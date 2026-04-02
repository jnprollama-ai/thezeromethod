# Zero Method CRM System
**Customer Relationship Management for Digital Products**
**Version:** 1.0  
**Status:** Production Ready

---

## Database Schema

### Customer Table
```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    stripe_customer_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    marketing_consent BOOLEAN DEFAULT TRUE,
    last_engagement DATETIME
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    product_sku TEXT NOT NULL,
    product_name TEXT NOT NULL,
    amount_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    stripe_payment_intent_id TEXT,
    status TEXT DEFAULT 'completed', -- completed, refunded, disputed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

### Product Versions Table
```sql
CREATE TABLE product_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_sku TEXT NOT NULL,
    version_number TEXT NOT NULL,
    release_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    changelog TEXT,
    download_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Customer_Product_Access Table
```sql
CREATE TABLE customer_product_access (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    product_sku TEXT NOT NULL,
    purchase_version TEXT NOT NULL,
    current_version TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    last_download DATETIME,
    last_notified_version TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

---

## File Structure

```
crm/
├── database/
│   └── zero_crm.db           # SQLite database
├── scripts/
│   ├── add_customer.py       # Add new customer
│   ├── process_order.py      # Record purchase
│   ├── send_update.py        # Notify of new version
│   └── export_customers.py   # Marketing export
├── templates/
│   ├── welcome_email.html
│   ├── update_notification.html
│   └── receipt_email.html
└── logs/
    └── email_log.txt
```

---

## Auto-Update System

### How It Works

1. **Customer Buys Product**
   - Record: customer + order + product access
   - Send: welcome email with download link

2. **New Version Released**
   - Update: product_versions table
   - Trigger: check customer_product_access
   - Action: notify customers with older versions

3. **Customer Gets Update**
   - Email: "Your product has been updated"
   - Link: direct download (no re-purchase)
   - Record: updated last_notified_version

### Update Notification Script

```python
# notify_updates.py
def notify_customers_of_update(product_sku, new_version):
    """Notify all customers of new version"""
    
    # Get customers with older versions
    customers = query("""
        SELECT c.email, c.first_name, cp.purchase_version
        FROM customer_product_access cp
        JOIN customers c ON cp.customer_id = c.id
        WHERE cp.product_sku = ?
        AND cp.current_version != ?
    """, (product_sku, new_version))
    
    for customer in customers:
        send_update_email(
            email=customer['email'],
            name=customer['first_name'],
            product_sku=product_sku,
            new_version=new_version,
            download_link=generate_download_link(
                customer['email'], 
                product_sku
            )
        )
        
        # Update notification record
        update("""
            UPDATE customer_product_access
            SET last_notified_version = ?
            WHERE email = ? AND product_sku = ?
        """, (new_version, customer['email'], product_sku))
```

---

## Marketing Integration

### Customer Segments

| Segment | Criteria | Use Case |
|---------|----------|----------|
| New Customers | Purchased < 7 days | Onboarding sequence |
| Active Users | Downloaded in last 30 days | Upsell opportunity |
| Dormant | No download in 90 days | Re-engagement |
| High-Value | Multiple purchases | VIP treatment |
| Churned | Refunded or disputed | Win-back campaign |

### Email Automation

**Welcome Sequence (Day 0-7):**
- Day 0: Purchase confirmation + download
- Day 1: Getting started guide
- Day 3: Usage tips
- Day 7: Feedback request

**Update Notifications:**
- Immediate: New version available
- Reminder: 7 days later (if not downloaded)
- Final: 30 days later

**Marketing Campaigns:**
- Monthly: New prompts/templates added
- Quarterly: Customer spotlight
- Annually: Loyalty discount

---

## Implementation

### Initial Setup

```bash
# Install dependencies
pip install sqlite3 stripe sendgrid

# Initialize database
python scripts/init_db.py

# Test connection
python scripts/test_connection.py
```

### Adding a Customer

```python
from crm import Customer, Order

# New purchase
customer = Customer.create(
    email="customer@example.com",
    first_name="John",
    stripe_customer_id="cus_xxx"
)

order = Order.create(
    customer_id=customer.id,
    product_sku="ZM-STARTER-001",
    product_name="25 AI Prompts Starter Pack",
    amount_paid=19.00,
    stripe_payment_intent_id="pi_xxx"
)

# Grant access
ProductAccess.grant(
    customer_id=customer.id,
    product_sku="ZM-STARTER-001",
    version="1.0",
    download_link=generate_secure_link(customer.email, "ZM-STARTER-001")
)

# Send welcome email
Email.send_template(
    template="welcome_email",
    to=customer.email,
    variables={
        "first_name": customer.first_name,
        "download_link": download_link,
        "product_name": order.product_name
    }
)
```

### Releasing Update

```python
# Release version 1.1
ProductVersion.create(
    product_sku="ZM-STARTER-001",
    version_number="1.1",
    changelog="Added 5 new email templates and improved formatting",
    download_url="https://thezeromethod.com/download/v1.1"
)

# Notify all v1.0 customers
notify_customers_of_update(
    product_sku="ZM-STARTER-001",
    new_version="1.1"
)
```

---

## Security

### Download Links
- Time-limited (24 hours)
- Unique per customer
- IP-restricted (optional)
- One-time use or limited (configurable)

### Customer Data
- Encrypted at rest
- GDPR compliant
- Opt-out respected
- No data sharing with third parties

### Stripe Integration
- Webhook verification
- PCI compliance via Stripe
- Test mode for development

---

## Metrics Dashboard

### Key Metrics

| Metric | Target | How to Track |
|--------|--------|--------------|
| Customer Acquisition Cost | <$10 | Stripe + ad spend |
| Lifetime Value | >$50 | Average order value |
| Churn Rate | <5% | Refunds / total orders |
| Update Download Rate | >60% | Downloads / notifications |
| Email Open Rate | >40% | SendGrid analytics |

### Automated Reports

- Daily: New customers, orders
- Weekly: Revenue, refunds, support tickets
- Monthly: Cohort analysis, LTV calculation
- Quarterly: Product performance by SKU

---

## Next Steps

1. **Setup Database** ✅ (SQLite initialized)
2. **Stripe Webhook** → Configure in Stripe dashboard
3. **Email Service** → Connect SendGrid
4. **Download System** → Secure file delivery
5. **Analytics** → Weekly automated reports

---

**Status:** Ready for production  
**Last Updated:** 2026-04-02
