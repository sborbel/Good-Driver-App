from ebaysdk.finding import Connection as finding
import os

ebay_app_id = os.getenv("EBAY_APP_ID")

def find_items_by_keyword(keywords):
    f = finding(domain='svcs.ebay.com', appid=ebay_app_id, config_file=None)
    return_obj = []
    f.execute('findItemsAdvanced', 
                {'keywords': keywords}
             )

    return f.response.dict()
