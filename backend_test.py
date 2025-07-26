#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for LeZelote-IA
Tests all API endpoints using the public URL
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class LeZeloteAPITester:
    def __init__(self, base_url: str = "https://79166d71-8126-473e-9b64-c9c55bc85b85.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, files: Optional[Dict] = None) -> tuple:
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {'Content-Type': 'application/json'}
        
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if files:
                    # Remove Content-Type for file uploads
                    headers.pop('Content-Type', None)
                    response = requests.post(url, headers=headers, files=files, data=data)
                else:
                    response = requests.post(url, headers=headers, json=data)
            elif method == 'PUT':
                response = requests.put(url, headers=headers, json=data)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            else:
                return False, {"error": f"Unsupported method: {method}"}
            
            return response.status_code, response.json() if response.content else {}
        
        except requests.exceptions.RequestException as e:
            return 0, {"error": str(e)}
        except json.JSONDecodeError:
            return response.status_code, {"error": "Invalid JSON response"}

    def test_health_check(self):
        """Test health check endpoint"""
        status_code, response = self.make_request('GET', '/health')
        success = status_code == 200 and response.get('status') in ['healthy', 'unhealthy']
        self.log_test("Health Check", success, f"Status: {status_code}, Response: {response}")
        return success

    def test_root_endpoint(self):
        """Test root API endpoint"""
        status_code, response = self.make_request('GET', '/')
        success = status_code == 200 and 'LeZelote-IA API' in response.get('message', '')
        self.log_test("Root Endpoint", success, f"Status: {status_code}, Response: {response}")
        return success

    def test_user_registration(self):
        """Test user registration"""
        user_data = {
            "name": "Test User API",
            "email": f"test_api_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPassword123!",
            "company": "Test Company",
            "phone": "+1234567890"
        }
        
        status_code, response = self.make_request('POST', '/auth/register', user_data)
        success = status_code == 200 and 'id' in response
        
        if success:
            self.user_id = response['id']
        
        self.log_test("User Registration", success, f"Status: {status_code}, Response: {response}")
        return success, user_data

    def test_user_login(self, email: str, password: str):
        """Test user login"""
        login_data = {
            "email": email,
            "password": password
        }
        
        status_code, response = self.make_request('POST', '/auth/login', login_data)
        success = status_code == 200 and 'access_token' in response
        
        if success:
            self.token = response['access_token']
        
        self.log_test("User Login", success, f"Status: {status_code}, Token received: {bool(self.token)}")
        return success

    def test_existing_user_login(self):
        """Test login with existing demo user"""
        return self.test_user_login("jean.dupont@example.com", "password")

    def test_get_current_user(self):
        """Test getting current user info"""
        status_code, response = self.make_request('GET', '/auth/me')
        success = status_code == 200 and 'id' in response and 'email' in response
        self.log_test("Get Current User", success, f"Status: {status_code}, User: {response.get('name', 'N/A')}")
        return success

    def test_dashboard(self):
        """Test dashboard endpoint"""
        status_code, response = self.make_request('GET', '/dashboard')
        success = status_code == 200 and 'stats' in response and 'recent_workflows' in response
        self.log_test("Dashboard", success, f"Status: {status_code}, Stats available: {bool(response.get('stats'))}")
        return success

    def test_workflows_crud(self):
        """Test workflow CRUD operations"""
        # Create workflow
        workflow_data = {
            "name": "Test Workflow API",
            "description": "Test workflow created via API",
            "category": "automation",
            "ai_model": "GPT-4"
        }
        
        status_code, response = self.make_request('POST', '/workflows', workflow_data)
        create_success = status_code == 200 and 'id' in response
        workflow_id = response.get('id') if create_success else None
        
        self.log_test("Create Workflow", create_success, f"Status: {status_code}, ID: {workflow_id}")
        
        if not create_success:
            return False
        
        # Get workflows
        status_code, response = self.make_request('GET', '/workflows')
        list_success = status_code == 200 and isinstance(response, list)
        self.log_test("List Workflows", list_success, f"Status: {status_code}, Count: {len(response) if list_success else 0}")
        
        # Get specific workflow
        status_code, response = self.make_request('GET', f'/workflows/{workflow_id}')
        get_success = status_code == 200 and response.get('id') == workflow_id
        self.log_test("Get Workflow", get_success, f"Status: {status_code}, ID matches: {get_success}")
        
        # Update workflow
        update_data = {
            "name": "Updated Test Workflow",
            "status": "active"
        }
        status_code, response = self.make_request('PUT', f'/workflows/{workflow_id}', update_data)
        update_success = status_code == 200 and response.get('name') == update_data['name']
        self.log_test("Update Workflow", update_success, f"Status: {status_code}, Name updated: {update_success}")
        
        # Delete workflow
        status_code, response = self.make_request('DELETE', f'/workflows/{workflow_id}')
        delete_success = status_code == 200
        self.log_test("Delete Workflow", delete_success, f"Status: {status_code}")
        
        return create_success and list_success and get_success and update_success and delete_success

    def test_leads_crud(self):
        """Test lead CRUD operations"""
        # Create lead
        lead_data = {
            "name": "Test Lead API",
            "email": f"lead_api_{datetime.now().strftime('%H%M%S')}@example.com",
            "company": "Test Lead Company",
            "phone": "+1234567890",
            "source": "API Test"
        }
        
        status_code, response = self.make_request('POST', '/leads', lead_data)
        create_success = status_code == 200 and 'id' in response
        lead_id = response.get('id') if create_success else None
        
        self.log_test("Create Lead", create_success, f"Status: {status_code}, ID: {lead_id}")
        
        if not create_success:
            return False
        
        # Get leads
        status_code, response = self.make_request('GET', '/leads')
        list_success = status_code == 200 and isinstance(response, list)
        self.log_test("List Leads", list_success, f"Status: {status_code}, Count: {len(response) if list_success else 0}")
        
        # Get specific lead
        status_code, response = self.make_request('GET', f'/leads/{lead_id}')
        get_success = status_code == 200 and response.get('id') == lead_id
        self.log_test("Get Lead", get_success, f"Status: {status_code}, ID matches: {get_success}")
        
        # Update lead
        update_data = {
            "status": "hot",
            "score": 85
        }
        status_code, response = self.make_request('PUT', f'/leads/{lead_id}', update_data)
        update_success = status_code == 200 and response.get('status') == update_data['status']
        self.log_test("Update Lead", update_success, f"Status: {status_code}, Status updated: {update_success}")
        
        return create_success and list_success and get_success and update_success

    def test_email_campaigns(self):
        """Test email campaign operations"""
        # Create campaign
        campaign_data = {
            "name": "Test Campaign API",
            "type": "automated",
            "subject": "Test Email Subject",
            "content": "This is a test email content"
        }
        
        status_code, response = self.make_request('POST', '/email-campaigns', campaign_data)
        create_success = status_code == 200 and 'id' in response
        campaign_id = response.get('id') if create_success else None
        
        self.log_test("Create Email Campaign", create_success, f"Status: {status_code}, ID: {campaign_id}")
        
        # Get campaigns
        status_code, response = self.make_request('GET', '/email-campaigns')
        list_success = status_code == 200 and isinstance(response, list)
        self.log_test("List Email Campaigns", list_success, f"Status: {status_code}, Count: {len(response) if list_success else 0}")
        
        return create_success and list_success

    def test_support_tickets(self):
        """Test support ticket operations"""
        # Create ticket
        ticket_data = {
            "subject": "Test Support Ticket API",
            "category": "technical",
            "description": "This is a test support ticket created via API"
        }
        
        status_code, response = self.make_request('POST', '/tickets', ticket_data)
        create_success = status_code == 200 and 'id' in response
        ticket_id = response.get('id') if create_success else None
        
        self.log_test("Create Support Ticket", create_success, f"Status: {status_code}, ID: {ticket_id}")
        
        # Get tickets
        status_code, response = self.make_request('GET', '/tickets')
        list_success = status_code == 200 and isinstance(response, list)
        self.log_test("List Support Tickets", list_success, f"Status: {status_code}, Count: {len(response) if list_success else 0}")
        
        return create_success and list_success

    def test_api_keys(self):
        """Test API key management"""
        # Create API key
        api_key_data = {
            "name": "Test API Key",
            "permissions": ["read", "write"]
        }
        
        status_code, response = self.make_request('POST', '/api-keys', api_key_data)
        create_success = status_code == 200 and 'id' in response and 'key' in response
        api_key_id = response.get('id') if create_success else None
        
        self.log_test("Create API Key", create_success, f"Status: {status_code}, ID: {api_key_id}")
        
        # Get API keys
        status_code, response = self.make_request('GET', '/api-keys')
        list_success = status_code == 200 and isinstance(response, list)
        self.log_test("List API Keys", list_success, f"Status: {status_code}, Count: {len(response) if list_success else 0}")
        
        return create_success and list_success

    def test_chat(self):
        """Test chat functionality"""
        chat_data = {
            "message": "Hello, can you help me create a workflow?",
            "sender": "user",
            "model": "GPT-4"
        }
        
        status_code, response = self.make_request('POST', '/chat', chat_data)
        success = status_code == 200 and 'message' in response and 'sender' in response
        self.log_test("Chat with AI", success, f"Status: {status_code}, Response type: {response.get('type', 'N/A')}")
        return success

    def test_analytics(self):
        """Test analytics endpoint"""
        status_code, response = self.make_request('GET', '/analytics?days=7')
        success = status_code == 200 and 'metrics' in response
        self.log_test("Analytics", success, f"Status: {status_code}, Metrics available: {bool(response.get('metrics'))}")
        return success

    def test_integrations(self):
        """Test integrations endpoint"""
        status_code, response = self.make_request('GET', '/integrations')
        success = status_code == 200 and isinstance(response, list)
        self.log_test("List Integrations", success, f"Status: {status_code}, Count: {len(response) if success else 0}")
        return success

    def test_ai_models(self):
        """Test AI models endpoint"""
        status_code, response = self.make_request('GET', '/ai-models')
        success = status_code == 200 and isinstance(response, list)
        self.log_test("List AI Models", success, f"Status: {status_code}, Count: {len(response) if success else 0}")
        return success

    def test_documents(self):
        """Test document operations"""
        # Get documents
        status_code, response = self.make_request('GET', '/documents')
        list_success = status_code == 200 and isinstance(response, list)
        self.log_test("List Documents", list_success, f"Status: {status_code}, Count: {len(response) if list_success else 0}")
        return list_success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting LeZelote-IA API Tests")
        print(f"📡 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity tests
        self.test_health_check()
        self.test_root_endpoint()
        
        # Authentication tests
        login_success = self.test_existing_user_login()
        
        if not login_success:
            print("❌ Login failed, trying to register new user...")
            reg_success, user_data = self.test_user_registration()
            if reg_success:
                login_success = self.test_user_login(user_data['email'], user_data['password'])
        
        if not login_success:
            print("❌ Authentication failed completely. Stopping tests.")
            return self.print_summary()
        
        # Authenticated endpoint tests
        self.test_get_current_user()
        self.test_dashboard()
        
        # CRUD operation tests
        self.test_workflows_crud()
        self.test_leads_crud()
        self.test_email_campaigns()
        self.test_support_tickets()
        self.test_api_keys()
        
        # Feature tests
        self.test_chat()
        self.test_analytics()
        self.test_integrations()
        self.test_ai_models()
        self.test_documents()
        
        return self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        print("\n✅ Test completed!")
        return self.tests_passed == self.tests_run

def main():
    """Main test runner"""
    tester = LeZeloteAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())