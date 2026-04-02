import sqlite3
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, List

DB_PATH = 'zero_crm.db'

class Customer:
    @staticmethod
    def create(email: str, first_name: str = '', last_name: str = '', 
               stripe_customer_id: str = '') -> Dict:
        """Create a new customer"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO customers (email, first_name, last_name, stripe_customer_id)
                VALUES (?, ?, ?, ?)
            ''', (email, first_name, last_name, stripe_customer_id))
            
            customer_id = cursor.lastrowid
            conn.commit()
            
            return {
                'id': customer_id,
                'email': email,
                'first_name': first_name,
                'created': True
            }
        except sqlite3.IntegrityError:
            # Customer already exists
            cursor.execute('SELECT id FROM customers WHERE email = ?', (email,))
            existing = cursor.fetchone()
            return {
                'id': existing[0],
                'email': email,
                'created': False,
                'message': 'Customer already exists'
            }
        finally:
            conn.close()
    
    @staticmethod
    def get_by_email(email: str) -> Optional[Dict]:
        """Get customer by email"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, email, first_name, last_name, created_at, marketing_consent
            FROM customers WHERE email = ?
        ''', (email,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'id': row[0],
                'email': row[1],
                'first_name': row[2],
                'last_name': row[3],
                'created_at': row[4],
                'marketing_consent': row[5]
            }
        return None
    
    @staticmethod
    def get_all_for_marketing() -> List[Dict]:
        """Get all customers who opted into marketing"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, email, first_name, last_name
            FROM customers
            WHERE marketing_consent = 1
            ORDER BY created_at DESC
        ''')
        
        customers = []
        for row in cursor.fetchall():
            customers.append({
                'id': row[0],
                'email': row[1],
                'first_name': row[2],
                'last_name': row[3]
            })
        
        conn.close()
        return customers

class Order:
    @staticmethod
    def create(customer_id: int, product_sku: str, product_name: str,
               amount_paid: float, stripe_payment_intent_id: str = '') -> Dict:
        """Record a new order"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO orders (customer_id, product_sku, product_name, amount_paid, stripe_payment_intent_id)
            VALUES (?, ?, ?, ?, ?)
        ''', (customer_id, product_sku, product_name, amount_paid, stripe_payment_intent_id))
        
        order_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {'id': order_id, 'created': True}
    
    @staticmethod
    def get_customer_orders(customer_id: int) -> List[Dict]:
        """Get all orders for a customer"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, product_sku, product_name, amount_paid, created_at
            FROM orders
            WHERE customer_id = ?
            ORDER BY created_at DESC
        ''', (customer_id,))
        
        orders = []
        for row in cursor.fetchall():
            orders.append({
                'id': row[0],
                'product_sku': row[1],
                'product_name': row[2],
                'amount_paid': row[3],
                'created_at': row[4]
            })
        
        conn.close()
        return orders

class ProductAccess:
    @staticmethod
    def grant(customer_id: int, product_sku: str, version: str) -> Dict:
        """Grant customer access to a product"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO customer_product_access 
            (customer_id, product_sku, purchase_version, current_version)
            VALUES (?, ?, ?, ?)
        ''', (customer_id, product_sku, version, version))
        
        access_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            'id': access_id,
            'download_link': ProductAccess.generate_download_link(customer_id, product_sku, version)
        }
    
    @staticmethod
    def generate_download_link(customer_id: int, product_sku: str, version: str) -> str:
        """Generate secure download link"""
        # Create token from customer_id + product_sku + secret
        token = hashlib.sha256(
            f"{customer_id}:{product_sku}:{version}:SECRET_KEY".encode()
        ).hexdigest()[:32]
        
        return f"https://thezeromethod.com/download/{product_sku}?v={version}&t={token}"
    
    @staticmethod
    def get_accessible_products(customer_id: int) -> List[Dict]:
        """Get all products customer has access to"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT cpa.product_sku, cpa.current_version, cpa.purchase_version,
                   cpa.download_count, pv.download_url
            FROM customer_product_access cpa
            JOIN product_versions pv ON cpa.product_sku = pv.product_sku 
                                   AND cpa.current_version = pv.version_number
            WHERE cpa.customer_id = ?
        ''', (customer_id,))
        
        products = []
        for row in cursor.fetchall():
            products.append({
                'product_sku': row[0],
                'current_version': row[1],
                'purchase_version': row[2],
                'download_count': row[3],
                'download_url': row[4]
            })
        
        conn.close()
        return products
    
    @staticmethod
    def update_to_new_version(product_sku: str, old_version: str, new_version: str) -> int:
        """Update all customers to new version and return count"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE customer_product_access
            SET current_version = ?
            WHERE product_sku = ? AND current_version = ?
        ''', (new_version, product_sku, old_version))
        
        updated_count = cursor.rowcount
        conn.commit()
        conn.close()
        
        return updated_count

class EmailLog:
    @staticmethod
    def record_sent(customer_id: int, email_type: str, subject: str) -> int:
        """Log an email sent"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO email_log (customer_id, email_type, subject)
            VALUES (?, ?, ?)
        ''', (customer_id, email_type, subject))
        
        log_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return log_id

class Analytics:
    @staticmethod
    def get_revenue_summary(days: int = 30) -> Dict:
        """Get revenue summary for last N days"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT COUNT(*), SUM(amount_paid), AVG(amount_paid)
            FROM orders
            WHERE created_at >= datetime('now', ?)
        ''', (f'-{days} days',))
        
        row = cursor.fetchone()
        conn.close()
        
        return {
            'order_count': row[0] or 0,
            'total_revenue': row[1] or 0,
            'average_order': row[2] or 0
        }
    
    @staticmethod
    def get_customer_segments() -> Dict:
        """Get customer segmentation data"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # New customers (last 7 days)
        cursor.execute('''
            SELECT COUNT(*) FROM customers 
            WHERE created_at >= datetime('now', '-7 days')
        ''')
        new_customers = cursor.fetchone()[0]
        
        # Active customers (downloaded in last 30 days)
        cursor.execute('''
            SELECT COUNT(DISTINCT customer_id) 
            FROM customer_product_access
            WHERE last_download >= datetime('now', '-30 days')
        ''')
        active_customers = cursor.fetchone()[0]
        
        # Total customers
        cursor.execute('SELECT COUNT(*) FROM customers')
        total_customers = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total': total_customers,
            'new_last_7_days': new_customers,
            'active_last_30_days': active_customers,
            'dormant': total_customers - active_customers
        }

# Process purchase workflow
def process_purchase(email: str, first_name: str, product_sku: str, 
                     product_name: str, amount: float, stripe_id: str) -> Dict:
    """Complete purchase workflow"""
    
    # 1. Create or get customer
    customer = Customer.create(email, first_name)
    customer_id = customer['id']
    
    # 2. Record order
    order = Order.create(customer_id, product_sku, product_name, amount, stripe_id)
    
    # 3. Grant product access
    access = ProductAccess.grant(customer_id, product_sku, '1.0')
    
    # 4. Log welcome email
    EmailLog.record_sent(customer_id, 'welcome', f'Welcome to {product_name}')
    
    return {
        'success': True,
        'customer_id': customer_id,
        'order_id': order['id'],
        'download_link': access['download_link'],
        'message': 'Purchase processed successfully'
    }

if __name__ == '__main__':
    # Test the CRM
    print("Testing CRM...")
    
    # Test customer creation
    result = Customer.create('test@example.com', 'Test', 'User', 'cus_test123')
    print(f"Customer: {result}")
    
    # Test analytics
    segments = Analytics.get_customer_segments()
    print(f"Segments: {segments}")
