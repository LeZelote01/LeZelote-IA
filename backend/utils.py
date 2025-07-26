import secrets
import string
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import json
import asyncio
from sqlalchemy.orm import Session
from models import User, Analytics

def generate_api_key(length: int = 32) -> str:
    """Generate a random API key"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_secure_token(length: int = 64) -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(length)

def hash_string(text: str) -> str:
    """Hash a string using SHA-256"""
    return hashlib.sha256(text.encode()).hexdigest()

def format_currency(amount: float, currency: str = "EUR") -> str:
    """Format currency amount"""
    return f"{amount:.2f} {currency}"

def calculate_percentage(part: float, whole: float) -> float:
    """Calculate percentage"""
    if whole == 0:
        return 0
    return (part / whole) * 100

def format_duration(seconds: float) -> str:
    """Format duration in seconds to human readable format"""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes = seconds / 60
        return f"{minutes:.1f}m"
    else:
        hours = seconds / 3600
        return f"{hours:.1f}h"

def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return filename.split('.')[-1].lower() if '.' in filename else ''

def is_valid_email(email: str) -> bool:
    """Basic email validation"""
    return '@' in email and '.' in email.split('@')[1]

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename

def paginate_query(query, page: int = 1, per_page: int = 10):
    """Paginate SQLAlchemy query"""
    if page < 1:
        page = 1
    if per_page < 1:
        per_page = 10
    
    offset = (page - 1) * per_page
    return query.offset(offset).limit(per_page)

def calculate_lead_score(lead_data: Dict[str, Any]) -> int:
    """Calculate lead score based on various factors"""
    score = 0
    
    # Company size factor
    if lead_data.get('company'):
        score += 20
    
    # Email domain factor
    email = lead_data.get('email', '')
    if email:
        domain = email.split('@')[1] if '@' in email else ''
        if domain in ['gmail.com', 'yahoo.com', 'outlook.com']:
            score += 10
        else:
            score += 25  # Business email
    
    # Phone number factor
    if lead_data.get('phone'):
        score += 15
    
    # Source factor
    source = lead_data.get('source', '').lower()
    source_scores = {
        'referral': 30,
        'linkedin': 25,
        'website': 20,
        'email campaign': 15,
        'cold call': 10
    }
    score += source_scores.get(source, 10)
    
    # Activity factor
    if lead_data.get('last_activity'):
        last_activity = datetime.fromisoformat(lead_data['last_activity'].replace('Z', '+00:00'))
        days_since_activity = (datetime.now() - last_activity).days
        if days_since_activity <= 7:
            score += 20
        elif days_since_activity <= 30:
            score += 10
    
    return min(score, 100)  # Cap at 100

def predict_lead_value(lead_data: Dict[str, Any]) -> float:
    """Predict lead value based on historical data and factors"""
    base_value = 1000.0
    
    # Company size multiplier
    if lead_data.get('company'):
        base_value *= 1.5
    
    # Source multiplier
    source = lead_data.get('source', '').lower()
    source_multipliers = {
        'referral': 2.0,
        'linkedin': 1.5,
        'website': 1.3,
        'email campaign': 1.2,
        'cold call': 1.0
    }
    base_value *= source_multipliers.get(source, 1.0)
    
    # Score factor
    score = lead_data.get('score', 50)
    base_value *= (score / 100)
    
    # Add random factor for variation
    import random
    base_value *= random.uniform(0.8, 1.2)
    
    return round(base_value, 2)

def generate_ai_insights(lead_data: Dict[str, Any]) -> List[str]:
    """Generate AI insights for a lead"""
    insights = []
    
    score = lead_data.get('score', 0)
    if score >= 80:
        insights.append("Forte probabilité de conversion (85%)")
    elif score >= 60:
        insights.append("Probabilité modérée de conversion (60%)")
    else:
        insights.append("Nécessite du nurturing avant conversion")
    
    # Company insights
    if lead_data.get('company'):
        insights.append("Prospect d'entreprise - potentiel élevé")
    
    # Source insights
    source = lead_data.get('source', '').lower()
    if source == 'referral':
        insights.append("Recommandé par un client - très qualifié")
    elif source == 'linkedin':
        insights.append("Contact professionnel actif")
    elif source == 'website':
        insights.append("Intérêt démontré par visite du site")
    
    # Activity insights
    if lead_data.get('last_activity'):
        last_activity = datetime.fromisoformat(lead_data['last_activity'].replace('Z', '+00:00'))
        days_since_activity = (datetime.now() - last_activity).days
        if days_since_activity <= 3:
            insights.append("Activité récente - contacter rapidement")
        elif days_since_activity <= 7:
            insights.append("Activité cette semaine - bon timing")
        elif days_since_activity > 30:
            insights.append("Inactif depuis longtemps - relance nécessaire")
    
    return insights

def analyze_document_content(content: str, document_type: str) -> Dict[str, Any]:
    """Analyze document content and extract relevant data"""
    # This is a simplified mock analysis
    # In production, you would use OCR and NLP services
    
    extracted_data = {}
    
    if document_type == 'invoice':
        # Mock invoice analysis
        extracted_data = {
            'amount': 1250.00,
            'currency': 'EUR',
            'date': datetime.now().strftime('%Y-%m-%d'),
            'vendor': 'Mock Vendor',
            'items': ['Service A', 'Product B']
        }
    elif document_type == 'contract':
        # Mock contract analysis
        extracted_data = {
            'parties': ['Party A', 'Party B'],
            'duration': '12 months',
            'value': 50000.00,
            'start_date': datetime.now().strftime('%Y-%m-%d')
        }
    elif document_type == 'report':
        # Mock report analysis
        extracted_data = {
            'pages': 15,
            'sections': ['Executive Summary', 'Analysis', 'Recommendations'],
            'tables': 3,
            'charts': 2
        }
    
    return extracted_data

def calculate_confidence_score(extracted_data: Dict[str, Any]) -> float:
    """Calculate confidence score for extracted data"""
    # Mock confidence calculation
    # In production, this would be based on OCR quality and validation
    import random
    return round(random.uniform(0.85, 0.98), 2)

def log_analytics(db: Session, user_id: int, metric_name: str, metric_value: float, metadata: Optional[Dict[str, Any]] = None):
    """Log analytics data"""
    analytics = Analytics(
        user_id=user_id,
        metric_name=metric_name,
        metric_value=metric_value,
        metadata=metadata or {}
    )
    db.add(analytics)
    db.commit()

def get_user_analytics(db: Session, user_id: int, metric_name: Optional[str] = None, days: int = 30) -> List[Analytics]:
    """Get user analytics data"""
    query = db.query(Analytics).filter(Analytics.user_id == user_id)
    
    if metric_name:
        query = query.filter(Analytics.metric_name == metric_name)
    
    # Filter by date range
    start_date = datetime.now() - timedelta(days=days)
    query = query.filter(Analytics.date >= start_date)
    
    return query.order_by(Analytics.date.desc()).all()

def generate_workflow_suggestion(user_input: str) -> Dict[str, Any]:
    """Generate workflow suggestion based on user input"""
    # Mock workflow suggestion
    # In production, this would use NLP to understand user intent
    
    suggestions = {
        'email': {
            'name': 'Analyse d\'emails automatique',
            'steps': [
                'Connexion à votre boîte email',
                'Classification des emails',
                'Extraction des informations',
                'Génération de réponses'
            ],
            'ai_model': 'GPT-4',
            'estimated_time': 20
        },
        'cv': {
            'name': 'Analyse CV automatique',
            'steps': [
                'Réception CV par email',
                'Extraction texte OCR',
                'Analyse compétences IA',
                'Scoring automatique',
                'Notification RH'
            ],
            'ai_model': 'Claude',
            'estimated_time': 25
        },
        'facture': {
            'name': 'Traitement factures automatique',
            'steps': [
                'Upload facture',
                'Extraction données OCR',
                'Validation montants',
                'Intégration comptabilité'
            ],
            'ai_model': 'GPT-4',
            'estimated_time': 15
        }
    }
    
    # Simple keyword matching
    user_input_lower = user_input.lower()
    for keyword, suggestion in suggestions.items():
        if keyword in user_input_lower:
            return suggestion
    
    # Default suggestion
    return suggestions['email']

def format_ai_response(response: str, model: str = "GPT-4") -> str:
    """Format AI response"""
    return f"[{model}] {response}"

def validate_json(json_string: str) -> bool:
    """Validate JSON string"""
    try:
        json.loads(json_string)
        return True
    except json.JSONDecodeError:
        return False

async def process_async_task(task_func, *args, **kwargs):
    """Process async task"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, task_func, *args, **kwargs)