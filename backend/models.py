from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

# Enums
class WorkflowStatus(str, enum.Enum):
    ACTIVE = "active"
    DRAFT = "draft"
    PAUSED = "paused"
    ARCHIVED = "archived"

class DocumentStatus(str, enum.Enum):
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"

class LeadStatus(str, enum.Enum):
    HOT = "hot"
    WARM = "warm"
    COLD = "cold"

class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class SubscriptionPlan(str, enum.Enum):
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    company = Column(String)
    phone = Column(String)
    avatar = Column(String)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    workflows = relationship("Workflow", back_populates="owner")
    documents = relationship("Document", back_populates="owner")
    leads = relationship("Lead", back_populates="owner")
    tickets = relationship("SupportTicket", back_populates="customer")
    campaigns = relationship("EmailCampaign", back_populates="owner")
    subscription = relationship("Subscription", back_populates="user", uselist=False)
    api_keys = relationship("ApiKey", back_populates="user")
    security_logs = relationship("SecurityLog", back_populates="user")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan = Column(Enum(SubscriptionPlan), nullable=False)
    status = Column(String, default="active")
    next_billing = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="subscription")

class Workflow(Base):
    __tablename__ = "workflows"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(WorkflowStatus), default=WorkflowStatus.DRAFT)
    category = Column(String)
    icon = Column(String)
    ai_model = Column(String)
    triggers = Column(Integer, default=0)
    executions = Column(Integer, default=0)
    last_run = Column(DateTime)
    config = Column(JSON)
    steps = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="workflows")
    executions_log = relationship("WorkflowExecution", back_populates="workflow")

class WorkflowExecution(Base):
    __tablename__ = "workflow_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    workflow_id = Column(Integer, ForeignKey("workflows.id"), nullable=False)
    status = Column(String, nullable=False)
    started_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime)
    duration = Column(Float)  # in seconds
    input_data = Column(JSON)
    output_data = Column(JSON)
    error_message = Column(Text)
    tokens_used = Column(Integer)
    ai_model_used = Column(String)
    
    # Relationships
    workflow = relationship("Workflow", back_populates="executions_log")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PROCESSING)
    file_path = Column(String)
    file_size = Column(Integer)
    mime_type = Column(String)
    extracted_data = Column(JSON)
    confidence = Column(Float)
    processed_at = Column(DateTime)
    error_message = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="documents")

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    company = Column(String)
    phone = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    source = Column(String)
    status = Column(Enum(LeadStatus), default=LeadStatus.COLD)
    score = Column(Integer, default=0)
    predicted_value = Column(Float)
    last_activity = Column(DateTime)
    ai_insights = Column(JSON)
    tags = Column(JSON)
    custom_fields = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="leads")

class EmailCampaign(Base):
    __tablename__ = "email_campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    type = Column(String)  # automated, one-time
    subject = Column(String)
    content = Column(Text)
    recipients = Column(Integer, default=0)
    sent = Column(Integer, default=0)
    opened = Column(Integer, default=0)
    clicked = Column(Integer, default=0)
    converted = Column(Integer, default=0)
    revenue = Column(Float, default=0.0)
    steps = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="campaigns")

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM)
    category = Column(String)
    description = Column(Text)
    ai_sentiment = Column(String)
    ai_summary = Column(Text)
    ai_suggested_actions = Column(JSON)
    resolved_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    customer = relationship("User", back_populates="tickets")

class ApiKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key = Column(String, unique=True, nullable=False)
    permissions = Column(JSON)
    last_used = Column(DateTime)
    calls_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="api_keys")

class SecurityLog(Base):
    __tablename__ = "security_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    ip_address = Column(String)
    user_agent = Column(String)
    location = Column(String)
    status = Column(String)
    details = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="security_logs")

class Integration(Base):
    __tablename__ = "integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    icon = Column(String)
    category = Column(String)
    status = Column(String, default="available")
    config = Column(JSON)
    api_calls = Column(Integer, default=0)
    last_sync = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class AiModel(Base):
    __tablename__ = "ai_models"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    model_id = Column(String, nullable=False)
    description = Column(Text)
    strengths = Column(JSON)
    price_per_token = Column(Float)
    max_tokens = Column(Integer)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=func.now())
    metric_name = Column(String, nullable=False)
    metric_value = Column(Float)
    meta_data = Column(JSON)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User")