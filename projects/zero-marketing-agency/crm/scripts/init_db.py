import sqlite3
import os
from datetime import datetime

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'zero_crm.db')

def init_database():
    """Initialize the CRM database with all tables"""
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Customers table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            first_name TEXT,
            last_name TEXT,
            stripe_customer_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            marketing_consent BOOLEAN DEFAULT 1,
            last_engagement DATETIME
        )
    ''')
    
    # Orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            product_sku TEXT NOT NULL,
            product_name TEXT NOT NULL,
            amount_paid DECIMAL(10,2),
            currency TEXT DEFAULT 'USD',
            stripe_payment_intent_id TEXT,
            status TEXT DEFAULT 'completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    ''')
    
    # Product versions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS product_versions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_sku TEXT NOT NULL,
            version_number TEXT NOT NULL,
            release_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            changelog TEXT,
            download_url TEXT,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Customer product access table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS customer_product_access (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            product_sku TEXT NOT NULL,
            purchase_version TEXT NOT NULL,
            current_version TEXT NOT NULL,
            download_count INTEGER DEFAULT 0,
            last_download DATETIME,
            last_notified_version TEXT,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    ''')
    
    # Email log table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS email_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            email_type TEXT,
            subject TEXT,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            opened BOOLEAN DEFAULT 0,
            clicked BOOLEAN DEFAULT 0,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    ''')
    
    # Create indexes for faster queries
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_orders_product ON orders(product_sku)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_product_versions_sku ON product_versions(product_sku)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_access_customer ON customer_product_access(customer_id)')
    
    # Insert initial product versions
    products = [
        ('ZM-STARTER-001', '1.0', '25 AI Prompts + 10 Templates Starter Pack', 'https://thezeromethod.com/download/starter-v1.0'),
        ('ZM-STARTER-001', '1.1', 'Updated with 5 bonus prompts', 'https://thezeromethod.com/download/starter-v1.1'),
        ('ZM-PRO-001', '2.0', 'Professional Suite (Coming Soon)', 'https://thezeromethod.com/download/pro-v2.0'),
    ]
    
    for sku, version, changelog, url in products:
        cursor.execute('''
            INSERT OR IGNORE INTO product_versions (product_sku, version_number, changelog, download_url)
            VALUES (?, ?, ?, ?)
        ''', (sku, version, changelog, url))
    
    conn.commit()
    conn.close()
    
    print(f"✅ Database initialized: {DB_PATH}")
    print("✅ Tables created: customers, orders, product_versions, customer_product_access, email_log")
    print("✅ Indexes created for performance")
    print("✅ Initial product versions added")

if __name__ == '__main__':
    init_database()
