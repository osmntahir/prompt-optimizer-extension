# Privacy Policy

**Effective Date:** October 25, 2025  
**Last Updated:** October 25, 2025  
**Version:** 1.0.0

---

## Introduction

This Privacy Policy describes how Prompt Optimizer ("we", "our", or "the Extension") collects, uses, and protects information when you use our Chrome browser extension. We are committed to protecting your privacy and ensuring transparency about our data practices.

By installing and using Prompt Optimizer, you agree to the collection and use of information in accordance with this policy.

---

## 1. Information We Collect

### 1.1 User Preferences (Local Storage Only)

**Information Collected:**
- Default tone preference (Formal, Casual, Technical, Concise, Neutral)
- Auto-optimization setting (enabled/disabled)
- History saving preference
- Notification preferences

**Storage Location:**
- Stored locally in your browser using Chrome's `chrome.storage.sync` API
- Data remains on your device only
- **NOT transmitted to any external servers**

**Purpose:**
- To personalize your experience with the Extension
- To remember your preferred settings across sessions

### 1.2 Optimization History (Local Storage Only)

**Information Collected:**
- Up to 10 most recent prompt optimizations (original and optimized versions)
- Timestamp of each optimization
- Settings used for optimization (tone, language, length)

**Storage Location:**
- Stored locally using Chrome's `chrome.storage.local` API
- Maximum of 10 records maintained (older records automatically deleted)
- **NOT synchronized or uploaded to any server**

**Purpose:**
- To allow users to review previous optimizations
- To enable quick copying and comparison of results

**User Control:**
- Users can clear history at any time through the settings page
- Users can disable history saving entirely

### 1.3 Usage Statistics (Local Storage Only)

**Information Collected:**
- Total number of optimizations performed
- Success/failure count of operations
- Most frequently used tone preferences

**Storage Location:**
- Stored exclusively on the user's device
- **Never transmitted externally**

**Purpose:**
- To display personal usage statistics to the user
- To help users understand their usage patterns

---

## 2. Data Transmitted to Third Parties

### 2.1 Google Gemini AI API

**Data Transmitted:**
- **Only** the text that the user explicitly selects and chooses to optimize
- User-selected optimization settings (tone, language, length preferences)

**Transmission Method:**
- Encrypted via HTTPS protocol
- **Only** when user manually initiates optimization (clicks "Optimize" or uses context menu)
- **No automatic or background data transmission**

**Third-Party Processing:**
- Data is processed by Google Gemini AI API under Google's privacy policy
- API authentication key is embedded within the Extension (not collected from users)
- Google's Privacy Policy: [https://policies.google.com/privacy](https://policies.google.com/privacy)

**Data NOT Transmitted:**
- ❌ Webpage content (other than user-selected text)
- ❌ Form data or input fields
- ❌ Passwords or authentication credentials
- ❌ Personal identifying information
- ❌ Browser cookies
- ❌ Browsing history
- ❌ User's full webpage context

---

## 3. Information We Do NOT Collect

We want to be explicitly clear about what we **do not** collect:

### 3.1 Personal Identifying Information (PII)
- ❌ Names, email addresses, or phone numbers
- ❌ User accounts or authentication credentials
- ❌ Social security numbers or government IDs
- ❌ Financial information or payment details

### 3.2 Browser Data
- ❌ Browsing history
- ❌ Open tabs or visited websites
- ❌ Form input data (except user-selected text for optimization)
- ❌ Browser cookies or cache
- ❌ Bookmarks or saved passwords

### 3.3 Analytics and Tracking
- ❌ Google Analytics or similar analytics services
- ❌ User behavior tracking or profiling
- ❌ IP addresses or location data
- ❌ Device fingerprinting
- ❌ Cross-site tracking

### 3.4 Advertising and Marketing
- ❌ Advertising IDs or profiles
- ❌ Marketing data or conversion tracking
- ❌ Third-party advertising network data
- ❌ Retargeting or remarketing information

---

## 4. Data Security

We implement industry-standard security measures to protect your information:

### 4.1 Encryption
- All API communications use HTTPS/TLS encryption
- Local data storage utilizes Chrome's secure `chrome.storage` API
- No unencrypted data transmission

### 4.2 Data Storage Security
- All data stored exclusively on user's local device
- No cloud backup or remote storage
- No centralized server infrastructure
- Data protected by Chrome's built-in security features

### 4.3 Data Deletion
- **Automatic deletion:** All Extension data is automatically removed when you uninstall the Extension
- **Manual deletion:** Users can clear optimization history at any time through the Settings page
- **Browser-level deletion:** Clearing Chrome's extension data will remove all stored information

---

## 5. Third-Party Services

### 5.1 Google Gemini AI API

The Extension uses Google's Gemini AI API solely for the purpose of optimizing user-selected text.

**Service Provider:** Google LLC  
**Purpose:** Text optimization and prompt enhancement  
**Data Shared:** Only user-selected text and optimization preferences  
**Privacy Policy:** [https://policies.google.com/privacy](https://policies.google.com/privacy)  
**Data Processing:** Governed by Google's Terms of Service

**No Other Third-Party Services:**
- ✅ **No analytics services** (Google Analytics, Mixpanel, etc.)
- ✅ **No crash reporting services** (Sentry, Crashlytics, etc.)
- ✅ **No advertising networks** (Google Ads, Facebook Ads, etc.)
- ✅ **No social media integrations** (except optional support links)
- ✅ **No marketing automation tools**

---

## 6. Children's Privacy

Prompt Optimizer is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.

---

## 7. Your Rights and Choices

You have the following rights regarding your data:

### 7.1 Right to Access
- View all stored data through the Extension's popup and settings interface
- Access optimization history and usage statistics at any time

### 7.2 Right to Delete
- Clear optimization history through the Settings page
- Disable history saving entirely through preferences
- Remove all Extension data by uninstalling the Extension

### 7.3 Right to Control
- Choose which data to store (history saving can be disabled)
- Control auto-optimization features
- Manage all Extension preferences independently

### 7.4 Right to Data Portability
- Export or copy your optimization history manually
- All data remains under your control on your local device

---

## 8. International Data Transfers

As the Extension stores all data locally on your device, there are no international data transfers, except when you explicitly use the optimization feature which sends selected text to Google's Gemini AI API. Google may process this data in accordance with their global infrastructure and privacy practices.

---

## 9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons.

**Notification of Changes:**
- The "Last Updated" date at the top of this policy will be revised
- Material changes will be communicated through the Extension's update notes
- Continued use of the Extension after changes constitutes acceptance of the updated policy

**Version History:**
- Version 1.0.0 - October 25, 2025 - Initial release

---

## 10. Legal Compliance

### 10.1 GDPR Compliance (European Users)
For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR):
- We process minimal data and only with user consent
- Users have the right to access, rectify, and delete their data
- Data is stored locally, minimizing data protection risks

### 10.2 CCPA Compliance (California Users)
For California residents, under the California Consumer Privacy Act (CCPA):
- We do not sell personal information
- We do not collect personal information for commercial purposes
- Users can request deletion of their data at any time

---

## 11. Contact Information

If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Developer:** Osman Tahir  
**GitHub Repository:** [https://github.com/osmntahir/prompt-optimizer-extension](https://github.com/osmntahir/prompt-optimizer-extension)  
**Support:** [https://github.com/osmntahir/prompt-optimizer-extension/issues](https://github.com/osmntahir/prompt-optimizer-extension/issues)  
**Email:** [Contact via GitHub Issues]

---

## 12. Summary

**What We Do:**
- ✅ Store user preferences locally on your device
- ✅ Send only user-selected text to Google Gemini AI for optimization
- ✅ Provide full user control over all data
- ✅ Use industry-standard encryption (HTTPS)
- ✅ Maintain transparency about our data practices

**What We Do NOT Do:**
- ❌ Collect personal identifying information
- ❌ Track user behavior or use analytics
- ❌ Sell or share data with third parties
- ❌ Display advertisements
- ❌ Store data on remote servers
- ❌ Access data beyond user-selected text

---

## 13. Open Source Transparency

Prompt Optimizer is developed as an open-source project. Our entire codebase is publicly available for inspection:

**Source Code:** [https://github.com/osmntahir/prompt-optimizer-extension](https://github.com/osmntahir/prompt-optimizer-extension)  
**License:** MIT License

You can review our code to verify our privacy practices and data handling.

---

## 14. Acceptance of This Policy

By installing and using Prompt Optimizer, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with this policy, please do not install or use the Extension.

---

**© 2025 Prompt Optimizer. All rights reserved.**

*This Privacy Policy is provided in English. For translations or clarifications, please contact us through our GitHub repository.*
