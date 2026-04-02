#!/usr/bin/env python3
"""
Zero Method - Product Delivery System
Handles post-purchase delivery via email
"""

import sqlite3
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os
from datetime import datetime

DB_PATH = 'zero_crm.db'

class ProductDelivery:
    def __init__(self):
        self.db_path = DB_PATH
        
    def process_purchase(self, customer_email, customer_name, stripe_payment_id):
        """Process new purchase and deliver product"""
        
        # 1. Create customer record
        customer_id = self._create_customer(customer_email, customer_name, stripe_payment_id)
        
        # 2. Record order
        order_id = self._record_order(customer_id, stripe_payment_id)
        
        # 3. Grant access
        access = self._grant_access(customer_id)
        
        # 4. Send delivery email
        self._send_delivery_email(customer_email, customer_name, access['download_link'])
        
        # 5. Log transaction
        self._log_transaction(customer_id, order_id, 'purchase_completed')
        
        return {
            'customer_id': customer_id,
            'order_id': order_id,
            'download_link': access['download_link'],
            'status': 'delivered'
        }
    
    def _create_customer(self, email, name, stripe_id):
        """Create customer in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR IGNORE INTO customers (email, first_name, stripe_customer_id, created_at)
            VALUES (?, ?, ?, ?)
        ''', (email, name, stripe_id, datetime.now()))
        
        customer_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return customer_id
    
    def _record_order(self, customer_id, stripe_payment_id):
        """Record order in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO orders (customer_id, product_sku, product_name, amount_paid, 
                              currency, stripe_payment_intent_id, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (customer_id, 'ZM-STARTER-001', 'Zero Method Starter Pack', 19.00, 
              'USD', stripe_payment_id, 'completed', datetime.now()))
        
        order_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return order_id
    
    def _grant_access(self, customer_id):
        """Grant product access and generate download link"""
        import hashlib
        
        # Generate secure download token
        token = hashlib.sha256(
            f"{customer_id}:ZM-STARTER-001:{datetime.now().timestamp()}:SECRET"
        ).hexdigest()[:32]
        
        download_link = f"https://thezeromethod.com/download?token={token}&v=1.0"
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO customer_product_access 
            (customer_id, product_sku, purchase_version, current_version, download_count)
            VALUES (?, ?, ?, ?, ?)
        ''', (customer_id, 'ZM-STARTER-001', '1.0', '1.0', 0))
        
        conn.commit()
        conn.close()
        
        return {'download_link': download_link, 'token': token}
    
    def _send_delivery_email(self, email, name, download_link):
        """Send product delivery email"""
        
        subject = "Your Zero Method Starter Pack is Ready"
        
        body = f"""
Hi {name},

Thanks for purchasing the Zero Method Starter Pack!

Your download is ready:
{download_link}

What's included:
✓ 25 AI Prompts (PDF + Markdown)
✓ 10 Email Templates
✓ Usage Guide

This link is unique to you and valid for 30 days. You can download it multiple times.

Questions? Reply to this email.

Thanks,
Zero
Zero Method Team

P.S. You have 30 days to request a refund if you're not satisfied. No questions asked.
"""
        
        # TODO: Configure SMTP settings
        # For now, log the email
        self._log_email(email, subject, 'delivery')
        
        # Return email content for manual sending or SMTP integration
        return {
            'to': email,
            'subject': subject,
            'body': body,
            'status': 'logged'
        }
    
    def _log_email(self, email, subject, email_type):
        """Log email in database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO email_log (email_type, subject, sent_at)
            VALUES (?, ?, ?)
        ''', (email_type, subject, datetime.now()))
        
        conn.commit()
        conn.close()
    
    def _log_transaction(self, customer_id, order_id, action):
        """Log transaction for audit"""
        print(f"[{datetime.now()}] Transaction: {action} | Customer: {customer_id} | Order: {order_id}")
    
    def handle_webhook(self, webhook_data):
        """Handle Stripe webhook for payment confirmation"""
        event_type = webhook_data.get('type')
        
        if event_type == 'checkout.session.completed':
            session = webhook_data['data']['object']
            customer_email = session['customer_details']['email']
            customer_name = session['customer_details'].get('name', 'Customer')
            stripe_payment_id = session['payment_intent']
            
            return self.process_purchase(customer_email, customer_name, stripe_payment_id)
        
        return {'status': 'ignored', 'event': event_type}

# Webhook endpoint for Stripe
def webhook_handler(request_data):
    """Main webhook handler"""
    delivery = ProductDelivery()
    return delivery.handle_webhook(request_data)

if __name__ == '__main__':
    # Test the system
    delivery = ProductDelivery()
    result = delivery.process_purchase(
        'test@example.com',
        'Test Customer',
        'pi_test_1234567890'
    )
    print(f"Delivery Result: {result}")
