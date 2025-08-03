import json

def handler(event, context):
    """Health check endpoint"""
    
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'status': 'API is running'})
    }