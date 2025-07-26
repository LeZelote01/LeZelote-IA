from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Enums
class WorkflowStatusEnum(str, Enum):
    ACTIVE = "active"
    DRAFT = "draft"
    PAUSED = "paused"
    ARCHIVED = "archived"

class DocumentStatusEnum(str, Enum):
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"

class LeadStatusEnum(str, Enum):
    HOT = "hot"
    WARM = "warm"
    COLD = "cold"

class TicketStatusEnum(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class CampaignStatusEnum(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"

class UserRoleEnum(str, Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class SubscriptionPlanEnum(str, Enum):
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"

# Base Schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseSchema):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRoleEnum
    is_active: bool
    created_at: datetime
    updated_at: datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Subscription Schemas
class SubscriptionBase(BaseSchema):
    plan: SubscriptionPlanEnum
    status: str = "active"
    next_billing: Optional[datetime] = None

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

# Workflow Schemas
class WorkflowBase(BaseSchema):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    ai_model: Optional[str] = None

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WorkflowStatusEnum] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    ai_model: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    steps: Optional[List[Dict[str, Any]]] = None

class WorkflowResponse(WorkflowBase):
    id: int
    owner_id: int
    status: WorkflowStatusEnum
    triggers: int
    executions: int
    last_run: Optional[datetime] = None
    config: Optional[Dict[str, Any]] = None
    steps: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    updated_at: datetime

# Workflow Execution Schemas
class WorkflowExecutionBase(BaseSchema):
    workflow_id: int
    status: str
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    tokens_used: Optional[int] = None
    ai_model_used: Optional[str] = None

class WorkflowExecutionCreate(WorkflowExecutionBase):
    pass

class WorkflowExecutionResponse(WorkflowExecutionBase):
    id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration: Optional[float] = None

# Document Schemas
class DocumentBase(BaseSchema):
    name: str
    type: str
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[DocumentStatusEnum] = None
    extracted_data: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = None
    processed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: int
    owner_id: int
    status: DocumentStatusEnum
    extracted_data: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = None
    processed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# Lead Schemas
class LeadBase(BaseSchema):
    name: str
    email: EmailStr
    company: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None

class LeadCreate(LeadBase):
    pass

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    status: Optional[LeadStatusEnum] = None
    score: Optional[int] = None
    predicted_value: Optional[float] = None
    last_activity: Optional[datetime] = None
    ai_insights: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None

class LeadResponse(LeadBase):
    id: int
    owner_id: int
    status: LeadStatusEnum
    score: int
    predicted_value: Optional[float] = None
    last_activity: Optional[datetime] = None
    ai_insights: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    custom_fields: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

# Email Campaign Schemas
class EmailCampaignBase(BaseSchema):
    name: str
    type: str
    subject: Optional[str] = None
    content: Optional[str] = None

class EmailCampaignCreate(EmailCampaignBase):
    pass

class EmailCampaignUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[CampaignStatusEnum] = None
    type: Optional[str] = None
    subject: Optional[str] = None
    content: Optional[str] = None
    recipients: Optional[int] = None
    sent: Optional[int] = None
    opened: Optional[int] = None
    clicked: Optional[int] = None
    converted: Optional[int] = None
    revenue: Optional[float] = None
    steps: Optional[List[Dict[str, Any]]] = None

class EmailCampaignResponse(EmailCampaignBase):
    id: int
    owner_id: int
    status: CampaignStatusEnum
    recipients: int
    sent: int
    opened: int
    clicked: int
    converted: int
    revenue: float
    steps: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    updated_at: datetime

# Support Ticket Schemas
class SupportTicketBase(BaseSchema):
    subject: str
    category: Optional[str] = None
    description: Optional[str] = None

class SupportTicketCreate(SupportTicketBase):
    pass

class SupportTicketUpdate(BaseModel):
    subject: Optional[str] = None
    status: Optional[TicketStatusEnum] = None
    priority: Optional[TicketPriorityEnum] = None
    category: Optional[str] = None
    description: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_suggested_actions: Optional[List[str]] = None
    resolved_at: Optional[datetime] = None

class SupportTicketResponse(SupportTicketBase):
    id: int
    customer_id: int
    status: TicketStatusEnum
    priority: TicketPriorityEnum
    ai_sentiment: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_suggested_actions: Optional[List[str]] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

# API Key Schemas
class ApiKeyBase(BaseSchema):
    name: str
    permissions: Optional[List[str]] = None

class ApiKeyCreate(ApiKeyBase):
    pass

class ApiKeyUpdate(BaseModel):
    name: Optional[str] = None
    permissions: Optional[List[str]] = None
    is_active: Optional[bool] = None

class ApiKeyResponse(ApiKeyBase):
    id: int
    user_id: int
    key: str
    last_used: Optional[datetime] = None
    calls_count: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

# Integration Schemas
class IntegrationBase(BaseSchema):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    api_calls: Optional[int] = None
    last_sync: Optional[datetime] = None

class IntegrationResponse(IntegrationBase):
    id: int
    status: str
    config: Optional[Dict[str, Any]] = None
    api_calls: int
    last_sync: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

# AI Model Schemas
class AiModelBase(BaseSchema):
    name: str
    provider: str
    model_id: str
    description: Optional[str] = None
    strengths: Optional[List[str]] = None
    price_per_token: Optional[float] = None
    max_tokens: Optional[int] = None

class AiModelCreate(AiModelBase):
    pass

class AiModelUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    model_id: Optional[str] = None
    description: Optional[str] = None
    strengths: Optional[List[str]] = None
    price_per_token: Optional[float] = None
    max_tokens: Optional[int] = None
    status: Optional[str] = None

class AiModelResponse(AiModelBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

# Analytics Schemas
class AnalyticsBase(BaseSchema):
    metric_name: str
    metric_value: float
    metadata: Optional[Dict[str, Any]] = None

class AnalyticsCreate(AnalyticsBase):
    pass

class AnalyticsResponse(AnalyticsBase):
    id: int
    user_id: int
    date: datetime
    created_at: datetime

# Chat Schemas
class ChatMessage(BaseSchema):
    message: str
    sender: str = "user"
    type: str = "text"
    model: Optional[str] = None
    
class ChatResponse(BaseSchema):
    id: str
    message: str
    sender: str = "ai"
    timestamp: datetime
    type: str = "text"
    model: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

# File Upload Schemas
class FileUploadResponse(BaseSchema):
    filename: str
    file_size: int
    mime_type: str
    file_path: str
    upload_id: str

# Dashboard Schemas
class DashboardStats(BaseSchema):
    total_workflows: int
    active_workflows: int
    total_executions: int
    success_rate: float
    time_saved: int
    cost_saved: float
    ai_tokens_used: int
    documents_processed: int
    leads_generated: int
    emails_sent: int

class DashboardResponse(BaseSchema):
    stats: DashboardStats
    recent_workflows: List[WorkflowResponse]
    recent_executions: List[WorkflowExecutionResponse]
    predictions: Dict[str, Any]