from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
import uuid
import json
from pathlib import Path

# Internal imports
from database import get_db, init_db, check_db_health
from models import (
    User, Workflow, Document, Lead, EmailCampaign, 
    SupportTicket, ApiKey, Integration, AiModel, Analytics
)
from schemas import (
    UserCreate, UserResponse, UserLogin, Token, UserUpdate,
    WorkflowCreate, WorkflowResponse, WorkflowUpdate,
    DocumentCreate, DocumentResponse, DocumentUpdate,
    LeadCreate, LeadResponse, LeadUpdate,
    EmailCampaignCreate, EmailCampaignResponse, EmailCampaignUpdate,
    SupportTicketCreate, SupportTicketResponse, SupportTicketUpdate,
    ApiKeyCreate, ApiKeyResponse, ApiKeyUpdate,
    IntegrationResponse, IntegrationUpdate,
    AiModelResponse,
    ChatMessage, ChatResponse,
    DashboardResponse, DashboardStats,
    FileUploadResponse
)
from auth import (
    authenticate_user, create_access_token, get_current_active_user,
    get_current_admin_user, create_user, get_password_hash
)
from utils import (
    generate_api_key, calculate_lead_score, predict_lead_value,
    generate_ai_insights, analyze_document_content, calculate_confidence_score,
    log_analytics, get_user_analytics, generate_workflow_suggestion,
    format_ai_response, sanitize_filename, paginate_query
)

# Initialize FastAPI app
app = FastAPI(
    title="LeZelote-IA API",
    description="API pour la plateforme d'automatisation intelligente LeZelote-IA",
    version="1.0.0"
)

# Create API router with prefix
api_router = APIRouter(prefix="/api")

# Security scheme
security = HTTPBearer()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "LeZelote-IA API v1.0.0", "status": "operational"}

# Health check endpoint
@api_router.get("/health")
async def health_check():
    db_healthy = check_db_health()
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "database": "connected" if db_healthy else "disconnected",
        "timestamp": datetime.utcnow().isoformat()
    }

# Authentication endpoints
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = create_user(
        db=db,
        email=user.email,
        password=user.password,
        name=user.name,
        company=user.company,
        phone=user.phone,
        avatar=user.avatar
    )
    
    return db_user

@api_router.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user and return access token"""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Log login activity
    log_analytics(db, user.id, "login", 1.0, {"ip": "127.0.0.1"})
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@api_router.put("/auth/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update current user information"""
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

# Dashboard endpoints
@api_router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard data"""
    # Get user's workflows
    workflows = db.query(Workflow).filter(Workflow.owner_id == current_user.id).all()
    
    # Calculate stats
    total_workflows = len(workflows)
    active_workflows = len([w for w in workflows if w.status == "active"])
    total_executions = sum(w.executions for w in workflows)
    
    # Mock calculations for demo
    stats = DashboardStats(
        total_workflows=total_workflows,
        active_workflows=active_workflows,
        total_executions=total_executions,
        success_rate=94.2,
        time_saved=156,
        cost_saved=12450.0,
        ai_tokens_used=2450000,
        documents_processed=1580,
        leads_generated=234,
        emails_sent=15670
    )
    
    # Get recent workflows
    recent_workflows = db.query(Workflow).filter(
        Workflow.owner_id == current_user.id
    ).order_by(Workflow.updated_at.desc()).limit(5).all()
    
    return DashboardResponse(
        stats=stats,
        recent_workflows=recent_workflows,
        recent_executions=[],
        predictions={
            "next_month_executions": 1850,
            "predicted_roi": 340,
            "churn_risk": 15,
            "growth_rate": 28
        }
    )

# Workflow endpoints
@api_router.post("/workflows", response_model=WorkflowResponse)
async def create_workflow(
    workflow: WorkflowCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new workflow"""
    db_workflow = Workflow(
        **workflow.dict(),
        owner_id=current_user.id
    )
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    
    # Log workflow creation
    log_analytics(db, current_user.id, "workflow_created", 1.0, {"workflow_id": db_workflow.id})
    
    return db_workflow

@api_router.get("/workflows", response_model=List[WorkflowResponse])
async def get_workflows(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's workflows"""
    query = db.query(Workflow).filter(Workflow.owner_id == current_user.id)
    
    if status:
        query = query.filter(Workflow.status == status)
    
    workflows = query.offset(skip).limit(limit).all()
    return workflows

@api_router.get("/workflows/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get specific workflow"""
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.owner_id == current_user.id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return workflow

@api_router.put("/workflows/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: int,
    workflow_update: WorkflowUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update workflow"""
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.owner_id == current_user.id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    for field, value in workflow_update.dict(exclude_unset=True).items():
        setattr(workflow, field, value)
    
    db.commit()
    db.refresh(workflow)
    
    # Log workflow update
    log_analytics(db, current_user.id, "workflow_updated", 1.0, {"workflow_id": workflow_id})
    
    return workflow

@api_router.delete("/workflows/{workflow_id}")
async def delete_workflow(
    workflow_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete workflow"""
    workflow = db.query(Workflow).filter(
        Workflow.id == workflow_id,
        Workflow.owner_id == current_user.id
    ).first()
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    db.delete(workflow)
    db.commit()
    
    # Log workflow deletion
    log_analytics(db, current_user.id, "workflow_deleted", 1.0, {"workflow_id": workflow_id})
    
    return {"message": "Workflow deleted successfully"}

# Document processing endpoints
@api_router.post("/documents/upload", response_model=FileUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Upload document for processing"""
    # Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = f"/tmp/{unique_filename}"
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create document record
    document = Document(
        name=file.filename,
        owner_id=current_user.id,
        type=file.content_type,
        file_path=file_path,
        file_size=len(content),
        mime_type=file.content_type
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    
    # Log document upload
    log_analytics(db, current_user.id, "document_uploaded", 1.0, {"document_id": document.id})
    
    return FileUploadResponse(
        filename=file.filename,
        file_size=len(content),
        mime_type=file.content_type,
        file_path=file_path,
        upload_id=str(document.id)
    )

@api_router.get("/documents", response_model=List[DocumentResponse])
async def get_documents(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's documents"""
    query = db.query(Document).filter(Document.owner_id == current_user.id)
    
    if status:
        query = query.filter(Document.status == status)
    
    documents = query.offset(skip).limit(limit).all()
    return documents

@api_router.get("/documents/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get specific document"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document

@api_router.post("/documents/{document_id}/process")
async def process_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Process document with OCR and AI"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Mock document processing
    document.status = "processed"
    document.processed_at = datetime.utcnow()
    document.extracted_data = analyze_document_content("", document.type)
    document.confidence = calculate_confidence_score(document.extracted_data)
    
    db.commit()
    db.refresh(document)
    
    # Log document processing
    log_analytics(db, current_user.id, "document_processed", 1.0, {"document_id": document_id})
    
    return {"message": "Document processed successfully", "document": document}

# Lead generation endpoints
@api_router.post("/leads", response_model=LeadResponse)
async def create_lead(
    lead: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new lead"""
    lead_data = lead.dict()
    
    # Calculate AI-powered lead score and insights
    score = calculate_lead_score(lead_data)
    predicted_value = predict_lead_value(lead_data)
    ai_insights = generate_ai_insights(lead_data)
    
    db_lead = Lead(
        **lead_data,
        owner_id=current_user.id,
        score=score,
        predicted_value=predicted_value,
        ai_insights=ai_insights,
        last_activity=datetime.utcnow()
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    
    # Log lead creation
    log_analytics(db, current_user.id, "lead_created", 1.0, {"lead_id": db_lead.id, "score": score})
    
    return db_lead

@api_router.get("/leads", response_model=List[LeadResponse])
async def get_leads(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's leads"""
    query = db.query(Lead).filter(Lead.owner_id == current_user.id)
    
    if status:
        query = query.filter(Lead.status == status)
    
    leads = query.offset(skip).limit(limit).all()
    return leads

@api_router.get("/leads/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get specific lead"""
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.owner_id == current_user.id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    return lead

@api_router.put("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_update: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update lead"""
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.owner_id == current_user.id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    for field, value in lead_update.dict(exclude_unset=True).items():
        setattr(lead, field, value)
    
    db.commit()
    db.refresh(lead)
    
    # Log lead update
    log_analytics(db, current_user.id, "lead_updated", 1.0, {"lead_id": lead_id})
    
    return lead

# Chat endpoints
@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Chat with AI assistant"""
    # Mock AI response
    ai_response = "Je comprends votre demande. Laissez-moi vous aider avec cela."
    
    # Check if it's a workflow suggestion request
    if any(keyword in message.message.lower() for keyword in ['workflow', 'créer', 'automatiser']):
        workflow_suggestion = generate_workflow_suggestion(message.message)
        return ChatResponse(
            id=str(uuid.uuid4()),
            message="workflow_suggestion",
            sender="ai",
            timestamp=datetime.utcnow(),
            type="workflow_suggestion",
            model=message.model or "GPT-4",
            data=workflow_suggestion
        )
    
    # Log chat interaction
    log_analytics(db, current_user.id, "chat_message", 1.0, {"model": message.model or "GPT-4"})
    
    return ChatResponse(
        id=str(uuid.uuid4()),
        message=format_ai_response(ai_response, message.model or "GPT-4"),
        sender="ai",
        timestamp=datetime.utcnow(),
        type="text",
        model=message.model or "GPT-4"
    )

# Analytics endpoints
@api_router.get("/analytics")
async def get_analytics(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user analytics"""
    analytics = get_user_analytics(db, current_user.id, days=days)
    
    # Group by metric
    metrics = {}
    for record in analytics:
        if record.metric_name not in metrics:
            metrics[record.metric_name] = []
        metrics[record.metric_name].append({
            "value": record.metric_value,
            "date": record.date.isoformat(),
            "metadata": record.metadata
        })
    
    return {"metrics": metrics}

# Email marketing endpoints
@api_router.post("/email-campaigns", response_model=EmailCampaignResponse)
async def create_email_campaign(
    campaign: EmailCampaignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create email campaign"""
    db_campaign = EmailCampaign(
        **campaign.dict(),
        owner_id=current_user.id
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    
    # Log campaign creation
    log_analytics(db, current_user.id, "email_campaign_created", 1.0, {"campaign_id": db_campaign.id})
    
    return db_campaign

@api_router.get("/email-campaigns", response_model=List[EmailCampaignResponse])
async def get_email_campaigns(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's email campaigns"""
    campaigns = db.query(EmailCampaign).filter(
        EmailCampaign.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    return campaigns

# Support ticket endpoints
@api_router.post("/tickets", response_model=SupportTicketResponse)
async def create_support_ticket(
    ticket: SupportTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create support ticket"""
    # Mock AI sentiment analysis
    ai_sentiment = "neutral"
    ai_summary = "Ticket créé automatiquement"
    ai_suggested_actions = ["Analyser le problème", "Contacter le support"]
    
    db_ticket = SupportTicket(
        **ticket.dict(),
        customer_id=current_user.id,
        ai_sentiment=ai_sentiment,
        ai_summary=ai_summary,
        ai_suggested_actions=ai_suggested_actions
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    # Log ticket creation
    log_analytics(db, current_user.id, "support_ticket_created", 1.0, {"ticket_id": db_ticket.id})
    
    return db_ticket

@api_router.get("/tickets", response_model=List[SupportTicketResponse])
async def get_support_tickets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's support tickets"""
    tickets = db.query(SupportTicket).filter(
        SupportTicket.customer_id == current_user.id
    ).offset(skip).limit(limit).all()
    return tickets

# API key management endpoints
@api_router.post("/api-keys", response_model=ApiKeyResponse)
async def create_api_key(
    api_key: ApiKeyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create API key"""
    key = f"lz_{generate_api_key()}"
    
    db_api_key = ApiKey(
        **api_key.dict(),
        user_id=current_user.id,
        key=key
    )
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)
    
    # Log API key creation
    log_analytics(db, current_user.id, "api_key_created", 1.0, {"api_key_id": db_api_key.id})
    
    return db_api_key

@api_router.get("/api-keys", response_model=List[ApiKeyResponse])
async def get_api_keys(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get user's API keys"""
    api_keys = db.query(ApiKey).filter(ApiKey.user_id == current_user.id).all()
    return api_keys

# Integration endpoints
@api_router.get("/integrations", response_model=List[IntegrationResponse])
async def get_integrations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get available integrations"""
    integrations = db.query(Integration).all()
    return integrations

# AI models endpoints
@api_router.get("/ai-models", response_model=List[AiModelResponse])
async def get_ai_models(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get available AI models"""
    models = db.query(AiModel).filter(AiModel.status == "active").all()
    return models

# Include the API router
app.include_router(api_router)

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "detail": exc.detail,
        "status_code": exc.status_code
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return {
        "detail": "Internal server error",
        "status_code": 500
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )