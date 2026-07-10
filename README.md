```bash
curl -X POST -F "file=@public/sample.csv;type=text/csv" http://localhost:3000/api/import
```

### Output 

```json
{
  "records": [
    {
      "created_at": "2026-07-11T16:15:00",
      "name": "Aarav Mehta",
      "email": "aarav.mehta@example.com",
      "country_code": "+91",
      "mobile_without_country_code": "9876543210",
      "company": "Mehta Builders",
      "city": "Pune",
      "state": "Maharashtra",
      "country": "India",
      "lead_owner": "neha@groweasy.ai",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "Follow-up: Asked for a 3 BHK brochure; alternate email and phone are also valid\nAdditional email: accounts@mehtabuilders.in\nAdditional phone: +91 99887 76655\nPipeline outcome: Call again next Tuesday",
      "data_source": "meridian_tower",
      "possession_time": "December 2026",
      "description": ""
    },
    {
      "created_at": "2026-07-10T09:30:00+05:30",
      "name": "Melissa Carter",
      "email": "melissa@northstar.example",
      "country_code": "+1",
      "mobile_without_country_code": "4155550182",
      "company": "Northstar Realty",
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "lead_owner": "ryan@groweasy.ai",
      "crm_status": "SALE_DONE",
      "crm_note": "Follow-up: Signed the agreement. Send onboarding details to the second email too.\nAdditional email: mel.carter@example.org",
      "data_source": "",
      "possession_time": "Ready to move",
      "description": ""
    },
    {
      "created_at": "2026-07-08T10:45:00",
      "name": "Rohan Iyer",
      "email": "rohan.iyer@example.in",
      "country_code": "+91",
      "mobile_without_country_code": "9900011223",
      "company": "Iyer Consulting",
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "lead_owner": "anita@groweasy.ai",
      "crm_status": "DID_NOT_CONNECT",
      "crm_note": "Follow-up: Phone rang twice; retry after 6 PM",
      "data_source": "sarjapur_plots",
      "possession_time": "Within 6 months",
      "description": ""
    }
  ],
  "skippedRecords": [
    {
      "sourceIndex": 3,
      "source": {
        "Submitted On": "2026-07-09",
        "Full Name / Contact": "Anonymous Event Visitor",
        "Email Address(es)": "",
        "WhatsApp / Mobile": "",
        "Organisation & Location": "Property Expo | Mumbai, India",
        "Assigned Rep": "",
        "Pipeline Outcome": "Interested",
        "Campaign / Project": "Eden Park",
        "Follow-up Comments": "Collected a brochure but provided neither email nor mobile; this row should be skipped",
        "Possession Preference": "Not specified"
      },
      "reason": "No email or mobile number provided."
    }
  ],
  "totalImported": 3,
  "totalSkipped": 1
}
```