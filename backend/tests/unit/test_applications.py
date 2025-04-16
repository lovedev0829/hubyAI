from unittest.mock import Mock  # Import from unittest.mock for mocking
import unittest
import sys
sys.path.insert(1, '../../')
#print("sys.path: ", sys.path)
from database import Database
from applications import Applications
import logging
from flask import Flask
import json

class ApplicationsTests(unittest.TestCase):

    def setUp(self):
        self.mock_app   = Flask(__name__)
        self.mock_request = Mock(name='Flask Request')
        self.mock_response = Mock(name='Flask Response')
        logFile = "unit_testing_log_file.log"
        self.dbCon   = Database(logFile)
        self.applications = Applications(self.mock_app, self.mock_request, self.dbCon)

    def test_update_app_webscrape_async(self):
        # Here we don't need Flask Mock since this function is outside of Applications class since it's being fired as async proc
        application_id = "65852dcde69ab247da4c30fe" # Github pilot
        expected_status = 200
        expected_json_keys = ["owner", "runtime", "source", "models", "marketing"]
        response = update_app_webscrape_async(application_id)
        dResponse   = json.loads(response.get_data())
        status      = response.status_code
        json_keys   = dResponse.keys()
        self.assertEqual(status, expected_status)
        self.assertEqual(sorted(json_keys) , sorted(expected_json_keys))
        return
    
    def test_placeholder_for_functions_of_applications():
        expected_status = 200
        expected_json_keys = ["a", "b", "c", "d", "e"]
        with self.mock_app.test_request_context():           # Note that test_request_context() is a reserved keyword.
            #self.mock_request.json = {"email": "dinesh.sharma@omyen.com", "password": "password"}
            login_response = self.users.login() 
            print("Response received is {} and status is: {}".format(login_response.get_data(), login_response.status_code))

            #(login_response, status) = self.users.login()  # This works for jsonify({}), <status_code>
            dResponse   = json.loads(login_response.get_data())
            status      = login_response.status_code
            json_keys   = dResponse.keys()
            self.assertEqual(status, expected_status)
            self.assertEqual(sorted(json_keys) , sorted(expected_json_keys))
       
        return
    # login fail test cases: 
    # Missing email or password or both; invalid email (not wellformed); incorrect email; incorrect password
    def test_login_failed(self):
        # Mock request data with JSON payload (replace with expected data)
        self.mock_request.json = {}
        expected_status = 400
        with self.mock_app.test_request_context():
            (login_response, status) = self.users.login()
            self.assertEqual(status, expected_status)
            
# Note: Replace the example logic in Users.login() and assertions with your actual implementation
if __name__ == '__main__':
    unittest.main()
    #u = UserTests()
    #u.test_login_success()
