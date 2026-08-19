---
name: whatsapp-meachat-integration
description: Implementation guide and templates for WhatsApp OTP authentication and data submission using the MeaChat (Mishat) API. Use this skill when asked to implement WhatsApp login, OTP verification, or form submission via WhatsApp in a new project.
---

# WhatsApp OTP & MeaChat Integration Skill

This skill provides the standard implementation for WhatsApp OTP authentication and data submission using the MeaChat (Mishat) API. Follow these guidelines when integrating WhatsApp functionality into a new project.

## 1. Request OTP (MeaChat API)
Use the MeaChat template API to send an OTP to the user's WhatsApp number.

### API Details:
- **Endpoint**: `POST https://app.meachat.com/api/v1/whatsapp/send/template`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Required Fields**:
  - `apiToken`: The MeaChat API token (usually from environment variables).
  - `phone_number_id`: The ID of the sender phone number (e.g., `"1188066204390074"`).
  - `template_id`: The approved template ID for OTP (e.g., `"424782"`).
  - `templateVariable-OTP-1`: The generated OTP string.
  - `phone_number`: The recipient's phone number (must be cleaned and formatted with country code).

### Example Implementation (Backend Function):
```typescript
export async function sendWhatsappOTP(phone: string, otp: string, apiToken: string) {
  const MEACHAT_API_URL = "https://app.meachat.com/api/v1/whatsapp/send/template";
  const formData = new URLSearchParams();
  
  formData.append("apiToken", apiToken);
  formData.append("phone_number_id", "1188066204390074");
  formData.append("template_id", "424782");
  formData.append("templateVariable-OTP-1", otp);
  formData.append("phone_number", phone);

  return fetch(MEACHAT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  });
}
```

## 2. Phone Number Cleaning
Before sending the request or storing it, phone numbers must be normalized:
1. Remove all non-numeric characters.
2. If it starts with `00`, remove the `00`.
3. If it starts with `0`, replace it with `966` (assuming Saudi Arabia as default).

```typescript
function cleanPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('00')) cleaned = cleaned.substring(2);
  if (cleaned.startsWith('0')) cleaned = '966' + cleaned.substring(1);
  return cleaned;
}
```

## 3. OTP Verification Flow
1. Generate a 6-digit random number.
2. Store the OTP in a Key-Value (KV) store or database with the phone number as the key.
3. Set an expiration time (e.g., 5 minutes).
4. When the user submits the OTP, compare it with the stored value.
5. If valid, delete the OTP from the store, create/retrieve the user session, and issue an authentication cookie.

## 4. Frontend Implementation
Provide a smooth UX by:
1. Validating the phone number length before submission.
2. Showing a loading state on the "Send OTP" button.
3. Displaying a 6-digit OTP input field once the request is successful.
4. Auto-submitting or validating the OTP as soon as the user enters the 6th digit.

## Developer Instructions:
When a user asks you to implement WhatsApp verification:
- Use this skill to structure the backend API routes for `request-otp` and `verify-otp`.
- Ensure the `MEACHAT_API_TOKEN` is loaded from the environment variables safely.
- Scaffold the frontend logic to handle the API calls as described in the flow.
