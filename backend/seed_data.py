#!/usr/bin/env python3
"""
Seed data for LeZelote-IA database
"""

from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import (
    User, Workflow, Document, Lead, EmailCampaign, SupportTicket,
    ApiKey, Integration, AiModel, Analytics, Subscription
)
from auth import get_password_hash
from datetime import datetime, timedelta
import json

def create_seed_data():
    """Create seed data for the database"""
    
    # Initialize database
    init_db()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Create demo user
        demo_user = User(
            name="Jean Dupont",
            email="jean.dupont@example.com",
            company="TechCorp SAS",
            phone="+33 1 23 45 67 89",
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            hashed_password=get_password_hash("password"),
            role="admin",
            is_active=True
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        
        # Create subscription
        subscription = Subscription(
            user_id=demo_user.id,
            plan="pro",
            status="active",
            next_billing=datetime.utcnow() + timedelta(days=30)
        )
        db.add(subscription)
        
        # Create AI models
        ai_models = [
            AiModel(
                name="GPT-4 Turbo",
                provider="OpenAI",
                model_id="gpt-4",
                description="Modèle de pointe pour la compréhension et génération de texte",
                strengths=["Raisonnement", "Créativité", "Code"],
                price_per_token=0.03,
                max_tokens=128000,
                status="active"
            ),
            AiModel(
                name="Claude Sonnet",
                provider="Anthropic",
                model_id="claude-sonnet-4-20250514",
                description="Excellence en analyse et sécurité, parfait pour les données sensibles",
                strengths=["Analyse", "Sécurité", "Éthique"],
                price_per_token=0.025,
                max_tokens=200000,
                status="active"
            ),
            AiModel(
                name="Mistral Large",
                provider="Mistral AI",
                model_id="mistral-large",
                description="Modèle français optimisé pour les langues européennes",
                strengths=["Multilingue", "Rapidité", "Coût"],
                price_per_token=0.02,
                max_tokens=32000,
                status="active"
            )
        ]
        
        for model in ai_models:
            db.add(model)
        
        # Create workflows
        workflows = [
            Workflow(
                name="Analyse de Prospects IA",
                description="Analyse automatique des prospects entrants avec scoring IA multi-modèles",
                owner_id=demo_user.id,
                status="active",
                category="Lead Generation",
                icon="🎯",
                ai_model="GPT-4",
                triggers=3,
                executions=127,
                last_run=datetime.utcnow() - timedelta(hours=2),
                config={"threshold": 80, "model": "GPT-4"},
                steps=[
                    {"id": "1", "name": "Réception lead", "type": "trigger"},
                    {"id": "2", "name": "Analyse IA", "type": "ai_analysis"},
                    {"id": "3", "name": "Scoring", "type": "scoring"},
                    {"id": "4", "name": "Notification", "type": "notification"}
                ]
            ),
            Workflow(
                name="Extraction Documents OCR",
                description="Extraction automatique de données depuis factures et contrats",
                owner_id=demo_user.id,
                status="active",
                category="Document Processing",
                icon="📄",
                ai_model="Claude",
                triggers=1,
                executions=89,
                last_run=datetime.utcnow() - timedelta(hours=1),
                config={"confidence_threshold": 0.9},
                steps=[
                    {"id": "1", "name": "Upload document", "type": "trigger"},
                    {"id": "2", "name": "OCR processing", "type": "ocr"},
                    {"id": "3", "name": "Data extraction", "type": "extraction"},
                    {"id": "4", "name": "Validation", "type": "validation"}
                ]
            ),
            Workflow(
                name="Support Client Intelligent",
                description="Chatbot IA pour support client 24/7 avec escalade automatique",
                owner_id=demo_user.id,
                status="active",
                category="Customer Service",
                icon="🎧",
                ai_model="Mistral",
                triggers=5,
                executions=234,
                last_run=datetime.utcnow() - timedelta(minutes=30),
                config={"escalation_threshold": 3},
                steps=[
                    {"id": "1", "name": "Message reçu", "type": "trigger"},
                    {"id": "2", "name": "Analyse sentiment", "type": "sentiment"},
                    {"id": "3", "name": "Réponse IA", "type": "ai_response"},
                    {"id": "4", "name": "Escalade si nécessaire", "type": "escalation"}
                ]
            ),
            Workflow(
                name="Email Marketing Automatisé",
                description="Campagnes email personnalisées avec segmentation IA",
                owner_id=demo_user.id,
                status="active",
                category="Marketing",
                icon="📧",
                ai_model="GPT-4",
                triggers=2,
                executions=156,
                last_run=datetime.utcnow() - timedelta(hours=4),
                config={"personalization": True},
                steps=[
                    {"id": "1", "name": "Déclencheur", "type": "trigger"},
                    {"id": "2", "name": "Segmentation", "type": "segmentation"},
                    {"id": "3", "name": "Personnalisation", "type": "personalization"},
                    {"id": "4", "name": "Envoi", "type": "send"}
                ]
            ),
            Workflow(
                name="Analytics Prédictives",
                description="Prédictions de tendances business avec ML avancé",
                owner_id=demo_user.id,
                status="draft",
                category="Analytics",
                icon="📊",
                ai_model="Claude",
                triggers=1,
                executions=23,
                last_run=datetime.utcnow() - timedelta(days=1),
                config={"prediction_horizon": 30},
                steps=[
                    {"id": "1", "name": "Collecte données", "type": "data_collection"},
                    {"id": "2", "name": "Analyse prédictive", "type": "prediction"},
                    {"id": "3", "name": "Visualisation", "type": "visualization"},
                    {"id": "4", "name": "Rapport", "type": "report"}
                ]
            )
        ]
        
        for workflow in workflows:
            db.add(workflow)
        
        # Create documents
        documents = [
            Document(
                name="Facture_TechCorp_2024-07-001.pdf",
                owner_id=demo_user.id,
                type="invoice",
                status="processed",
                file_path="/tmp/facture_001.pdf",
                file_size=245760,
                mime_type="application/pdf",
                extracted_data={
                    "amount": 1250.00,
                    "currency": "EUR",
                    "date": "2024-07-15",
                    "vendor": "TechCorp SAS",
                    "items": ["Licence Pro", "Support technique"]
                },
                confidence=0.96,
                processed_at=datetime.utcnow() - timedelta(hours=6)
            ),
            Document(
                name="Contrat_Service_2024.pdf",
                owner_id=demo_user.id,
                type="contract",
                status="processing",
                file_path="/tmp/contrat_2024.pdf",
                file_size=512000,
                mime_type="application/pdf"
            ),
            Document(
                name="Rapport_Mensuel_Juin.pdf",
                owner_id=demo_user.id,
                type="report",
                status="failed",
                file_path="/tmp/rapport_juin.pdf",
                file_size=1024000,
                mime_type="application/pdf",
                error_message="Document illisible",
                processed_at=datetime.utcnow() - timedelta(hours=12)
            )
        ]
        
        for document in documents:
            db.add(document)
        
        # Create leads
        leads = [
            Lead(
                name="Marie Dubois",
                email="marie.dubois@innovacorp.fr",
                company="InnovaCorp",
                phone="+33 1 23 45 67 89",
                owner_id=demo_user.id,
                source="Website",
                status="hot",
                score=85,
                predicted_value=2500.0,
                last_activity=datetime.utcnow() - timedelta(hours=2),
                ai_insights=[
                    "Forte probabilité de conversion (85%)",
                    "Intérêt pour les solutions d'automatisation",
                    "Budget estimé: 2000-3000€"
                ],
                tags=["qualified", "enterprise"],
                custom_fields={"industry": "Technology", "company_size": "50-100"}
            ),
            Lead(
                name="Pierre Martin",
                email="p.martin@startup-tech.com",
                company="StartupTech",
                phone="+33 6 78 90 12 34",
                owner_id=demo_user.id,
                source="LinkedIn",
                status="warm",
                score=72,
                predicted_value=1800.0,
                last_activity=datetime.utcnow() - timedelta(hours=8),
                ai_insights=[
                    "Évaluation active de solutions",
                    "Comparaison avec concurrents",
                    "Décision prévue fin du mois"
                ],
                tags=["startup", "promising"],
                custom_fields={"industry": "Software", "company_size": "10-20"}
            ),
            Lead(
                name="Sophie Laurent",
                email="sophie.laurent@sme-solutions.fr",
                company="SME Solutions",
                phone="+33 2 34 56 78 90",
                owner_id=demo_user.id,
                source="Email Campaign",
                status="cold",
                score=45,
                predicted_value=800.0,
                last_activity=datetime.utcnow() - timedelta(days=2),
                ai_insights=[
                    "Intérêt initial faible",
                    "Besoin de nurturing",
                    "Relance recommandée dans 2 semaines"
                ],
                tags=["nurturing", "cold"],
                custom_fields={"industry": "Consulting", "company_size": "5-10"}
            )
        ]
        
        for lead in leads:
            db.add(lead)
        
        # Create email campaigns
        email_campaigns = [
            EmailCampaign(
                name="Onboarding Nouveaux Clients",
                owner_id=demo_user.id,
                status="active",
                type="automated",
                subject="Bienvenue chez LeZelote-IA !",
                content="Contenu de l'email d'onboarding...",
                recipients=1250,
                sent=1200,
                opened=822,
                clicked=295,
                converted=108,
                revenue=15750.0,
                steps=[
                    {"order": 1, "subject": "Bienvenue chez LeZelote-IA !", "delay": 0},
                    {"order": 2, "subject": "Votre premier workflow en 5 minutes", "delay": 24},
                    {"order": 3, "subject": "Découvrez nos intégrations", "delay": 72},
                    {"order": 4, "subject": "Besoin d'aide ? Nous sommes là !", "delay": 168}
                ]
            ),
            EmailCampaign(
                name="Réactivation Clients Inactifs",
                owner_id=demo_user.id,
                status="draft",
                type="one-time",
                subject="Nous vous avons manqué !",
                content="Contenu de l'email de réactivation...",
                recipients=340,
                sent=0,
                opened=0,
                clicked=0,
                converted=0,
                revenue=0.0,
                steps=[
                    {"order": 1, "subject": "Nous vous avons manqué !", "delay": 0},
                    {"order": 2, "subject": "Offre spéciale retour", "delay": 48}
                ]
            )
        ]
        
        for campaign in email_campaigns:
            db.add(campaign)
        
        # Create support tickets
        support_tickets = [
            SupportTicket(
                subject="Problème avec l'intégration Slack",
                customer_id=demo_user.id,
                status="open",
                priority="high",
                category="Integration",
                description="L'intégration Slack ne fonctionne pas correctement depuis la mise à jour.",
                ai_sentiment="frustrated",
                ai_summary="Client frustré par l'échec de l'intégration Slack. Besoin d'aide technique urgente.",
                ai_suggested_actions=[
                    "Vérifier les permissions Slack",
                    "Proposer un appel de support",
                    "Escalader vers l'équipe technique"
                ]
            ),
            SupportTicket(
                subject="Question sur la facturation",
                customer_id=demo_user.id,
                status="resolved",
                priority="medium",
                category="Billing",
                description="Question sur les frais de dépassement dans la facturation.",
                ai_sentiment="neutral",
                ai_summary="Question standard sur la facturation. Résolue avec succès.",
                ai_suggested_actions=[],
                resolved_at=datetime.utcnow() - timedelta(hours=5)
            )
        ]
        
        for ticket in support_tickets:
            db.add(ticket)
        
        # Create API keys
        api_keys = [
            ApiKey(
                name="Production API",
                user_id=demo_user.id,
                key="lz_prod_1234567890abcdef",
                permissions=["read", "write"],
                last_used=datetime.utcnow() - timedelta(minutes=15),
                calls_count=15670,
                is_active=True
            ),
            ApiKey(
                name="Development API",
                user_id=demo_user.id,
                key="lz_dev_abcdef1234567890",
                permissions=["read"],
                last_used=datetime.utcnow() - timedelta(hours=12),
                calls_count=234,
                is_active=True
            )
        ]
        
        for api_key in api_keys:
            db.add(api_key)
        
        # Create integrations
        integrations = [
            Integration(
                name="Gmail",
                description="Connectez votre compte Gmail pour l'analyse d'emails",
                icon="📧",
                category="Email",
                status="available",
                config={"oauth_required": True},
                api_calls=1450,
                last_sync=datetime.utcnow() - timedelta(hours=2)
            ),
            Integration(
                name="Slack",
                description="Intégration avec Slack pour les notifications",
                icon="💬",
                category="Communication",
                status="available",
                config={"webhook_url": "https://hooks.slack.com/..."},
                api_calls=890,
                last_sync=datetime.utcnow() - timedelta(hours=1)
            ),
            Integration(
                name="Salesforce",
                description="Synchronisation avec votre CRM Salesforce",
                icon="⚡",
                category="CRM",
                status="available",
                config={"api_version": "v54.0"},
                api_calls=567,
                last_sync=datetime.utcnow() - timedelta(hours=3)
            ),
            Integration(
                name="DocuSign",
                description="Signatures électroniques automatisées",
                icon="✍️",
                category="Document",
                status="available",
                config={"sandbox": True},
                api_calls=0
            ),
            Integration(
                name="Stripe",
                description="Intégration pour les paiements et factures",
                icon="💳",
                category="Finance",
                status="available",
                config={"webhook_endpoint": "/api/webhooks/stripe"},
                api_calls=0
            )
        ]
        
        for integration in integrations:
            db.add(integration)
        
        # Create analytics data
        analytics_data = [
            Analytics(
                user_id=demo_user.id,
                date=datetime.utcnow() - timedelta(days=7),
                metric_name="workflow_executions",
                metric_value=89,
                metadata={"model": "GPT-4", "success_rate": 0.94}
            ),
            Analytics(
                user_id=demo_user.id,
                date=datetime.utcnow() - timedelta(days=6),
                metric_name="workflow_executions",
                metric_value=145,
                metadata={"model": "Claude", "success_rate": 0.96}
            ),
            Analytics(
                user_id=demo_user.id,
                date=datetime.utcnow() - timedelta(days=5),
                metric_name="workflow_executions",
                metric_value=123,
                metadata={"model": "Mistral", "success_rate": 0.91}
            ),
            Analytics(
                user_id=demo_user.id,
                date=datetime.utcnow() - timedelta(days=4),
                metric_name="workflow_executions",
                metric_value=167,
                metadata={"model": "GPT-4", "success_rate": 0.95}
            ),
            Analytics(
                user_id=demo_user.id,
                date=datetime.utcnow() - timedelta(days=3),
                metric_name="workflow_executions",
                metric_value=198,
                metadata={"model": "Claude", "success_rate": 0.97}
            ),
            Analytics(
                user_id=demo_user.id,
                date=datetime.utcnow() - timedelta(days=2),
                metric_name="workflow_executions",
                metric_value=178,
                metadata={"model": "Mistral", "success_rate": 0.93}
            ),
            Analytics(
                user_id=demo_user.id,
                date=datetime.utcnow() - timedelta(days=1),
                metric_name="workflow_executions",
                metric_value=156,
                metadata={"model": "GPT-4", "success_rate": 0.94}
            )
        ]
        
        for analytics in analytics_data:
            db.add(analytics)
        
        # Commit all changes
        db.commit()
        
        print("✅ Seed data created successfully!")
        print(f"Demo user created: {demo_user.email} / password")
        print(f"User ID: {demo_user.id}")
        print(f"Workflows created: {len(workflows)}")
        print(f"Documents created: {len(documents)}")
        print(f"Leads created: {len(leads)}")
        print(f"Email campaigns created: {len(email_campaigns)}")
        print(f"Support tickets created: {len(support_tickets)}")
        print(f"API keys created: {len(api_keys)}")
        print(f"Integrations created: {len(integrations)}")
        print(f"AI models created: {len(ai_models)}")
        print(f"Analytics records created: {len(analytics_data)}")
        
    except Exception as e:
        print(f"❌ Error creating seed data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()