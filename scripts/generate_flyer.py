import os
import sys
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def generate_pdf():
    # Setup page size: A4 (595.27 x 841.89 points)
    width = 595.27
    height = 841.89
    
    # Target PDF path
    pdf_path = os.path.join(os.path.dirname(__file__), '..', 'flyer.pdf')
    pdf_path = os.path.abspath(pdf_path)
    
    c = canvas.Canvas(pdf_path, pagesize=(width, height))
    
    # Register Japanese font from Windows System Fonts
    windir = os.environ.get('WINDIR', 'C:\\Windows')
    font_path = os.path.join(windir, 'Fonts', 'meiryo.ttc')
    
    # Use Meiryo if available, fallback to MS Gothic, then fallback to standard Helvetica
    font_registered = False
    for f_name in ['meiryo.ttc', 'msgothic.ttc', 'msmincho.ttc']:
        f_path = os.path.join(windir, 'Fonts', f_name)
        if os.path.exists(f_path):
            try:
                pdfmetrics.registerFont(TTFont('JPFont', f_path))
                pdfmetrics.registerFont(TTFont('JPFont-Bold', f_path, subfontIndex=1))
                font_registered = True
                print(f"Registered font: {f_name}")
                break
            except Exception as e:
                print(f"Error registering {f_name}: {e}")
                
    if not font_registered:
        # Fallback to Helvetica
        print("Warning: No Japanese system font registered. Falling back to Helvetica.")
        pdfmetrics.registerFont(TTFont('JPFont', 'Helvetica'))
        pdfmetrics.registerFont(TTFont('JPFont-Bold', 'Helvetica-Bold'))
        
    # Brand colors
    primary = HexColor('#0f172a')     # Slate 900 (Dark blue/black)
    secondary = HexColor('#1e293b')   # Slate 800
    accent = HexColor('#c4a164')      # Gold
    accent_bg = HexColor('#fbf9f5')   # Soft gold background tint
    text_dark = HexColor('#0f172a')
    text_light = HexColor('#475569')   # Slate 600
    white = HexColor('#ffffff')
    card_bg = HexColor('#ffffff')
    card_border = HexColor('#e2e8f0') # Slate 200
    
    # ----------------------------------------------------
    # 1. Background
    # ----------------------------------------------------
    c.setFillColor(HexColor('#f8fafc')) # Light grey background tint
    c.rect(0, 0, width, height, fill=1, stroke=0)
    
    # Header area background
    c.setFillColor(primary)
    c.rect(0, 680, width, 161.89, fill=1, stroke=0)
    
    # Header gold accent line
    c.setFillColor(accent)
    c.rect(0, 676, width, 4, fill=1, stroke=0)
    
    # ----------------------------------------------------
    # 2. Header Text
    # ----------------------------------------------------
    c.setFillColor(white)
    
    # Main Title
    c.setFont('JPFont-Bold', 34)
    c.drawCentredString(width / 2.0, 770, "AWAKE 無料計測会")
    
    # Subtitle
    c.setFont('JPFont', 14)
    c.setFillColor(accent)
    c.drawCentredString(width / 2.0, 740, "感覚の指導から、データによる科学的指導へ")
    
    # Target Audience
    c.setFont('JPFont-Bold', 12)
    c.setFillColor(white)
    c.drawCentredString(width / 2.0, 705, "対象：小学生・中学生のジュニアサッカー選手（個人・チーム参加OK）")
    
    # ----------------------------------------------------
    # 3. Main Image
    # ----------------------------------------------------
    image_path = os.path.join(os.path.dirname(__file__), '..', 'assets', 'j-youth-test.png')
    image_path = os.path.abspath(image_path)
    
    if os.path.exists(image_path):
        # Draw image container with gold border
        c.setFillColor(white)
        c.setStrokeColor(accent)
        c.setLineWidth(1.5)
        # Coordinates for image: x=40, y=410, w=515, h=250
        c.roundRect(38, 408, 519, 254, 8, fill=1, stroke=1)
        c.drawImage(image_path, 40, 410, width=515, height=250)
        print("Drew image on flyer.")
    else:
        # Fallback container if image not found
        c.setFillColor(HexColor('#e2e8f0'))
        c.setStrokeColor(accent)
        c.roundRect(40, 410, 515, 250, 8, fill=1, stroke=1)
        c.setFillColor(primary)
        c.setFont('JPFont-Bold', 16)
        c.drawCentredString(width / 2.0, 530, "[ トレーニング風景・計測器イメージ画像 ]")
        print(f"Image not found at: {image_path}")
        
    # ----------------------------------------------------
    # 4. Flyer Concept & Catchy text
    # ----------------------------------------------------
    c.setFillColor(text_dark)
    c.setFont('JPFont-Bold', 16)
    c.drawCentredString(width / 2.0, 365, "なぜJ下部組織や強豪クラブは走力を「数値化」するのか？")
    
    c.setFont('JPFont', 10.5)
    c.setFillColor(text_light)
    c.drawCentredString(width / 2.0, 345, "セレクションで必ず計測される10m走とプロアジリティテスト。")
    c.drawCentredString(width / 2.0, 330, "AWAKE無料計測会では、プロ水準の光電管レーザーセンサーを用いて正確に能力を可視化します。")
    
    # ----------------------------------------------------
    # 5. Features Grid (4 cards)
    # ----------------------------------------------------
    # Card coordinates helper: 2x2 grid
    # Row 1: y=210, Row 2: y=100
    # Col 1: x=40, Col 2: x=300
    card_w = 245
    card_h = 95
    gap_x = 30
    gap_y = 15
    
    features = [
        {
            "title": "① 光電管10mスプリント計測",
            "desc": "サッカーの勝負を分ける「初速（1歩目〜10mまでのダッシュ速度）」を、100分の1秒単位の高精度レーザーで正確に計測します。"
        },
        {
            "title": "② プロアジリティテスト計測",
            "desc": "試合中の切り返し・ターン動作に必要な「俊敏性」と「急減速力」を測定。サッカー特有の身体操作能力を数値化します。"
        },
        {
            "title": "③ 成長期（PHV）予測と姿勢分析",
            "desc": "琉球大学医学部修士修了トレーナーが監修。成長期のピークを予測し、怪我のリスク（オスグッド等）を未然に防ぐ分析を行います。"
        },
        {
            "title": "④ 専用クラウドでのデータ管理",
            "desc": "測定データはクラウド上で管理。いつでもスマートフォンから推移を確認でき、強みと課題がグラフで一目でわかります。"
        }
    ]
    
    # Draw cards
    for i, feat in enumerate(features):
        row = i // 2  # 0 or 1
        col = i % 2  # 0 or 1
        
        x = 40 + col * (card_w + gap_x)
        y = 205 - row * (card_h + gap_y)
        
        # Draw card background
        c.setFillColor(card_bg)
        c.setStrokeColor(card_border)
        c.setLineWidth(1)
        c.roundRect(x, y, card_w, card_h, 6, fill=1, stroke=1)
        
        # Draw small gold accent block on the left edge of each card
        c.setFillColor(accent)
        c.rect(x, y + 5, 4, card_h - 10, fill=1, stroke=0)
        
        # Draw title
        c.setFillColor(primary)
        c.setFont('JPFont-Bold', 11)
        c.drawString(x + 15, y + card_h - 22, feat["title"])
        
        # Draw description (wrapped in lines)
        c.setFillColor(text_light)
        c.setFont('JPFont', 8.5)
        
        desc = feat["desc"]
        # Break desc into lines manually for reportlab canvas
        line_chars = 24
        desc_lines = [desc[j:j+line_chars] for j in range(0, len(desc), line_chars)]
        
        for k, line in enumerate(desc_lines[:4]): # limit to 4 lines
            c.drawString(x + 15, y + card_h - 40 - (k * 13), line)
            
    # ----------------------------------------------------
    # 6. Call to Action / Campaign Info Box
    # ----------------------------------------------------
    # Coordinates: x=40, y=30, w=515, h=55
    c.setFillColor(accent_bg)
    c.setStrokeColor(accent)
    c.setLineWidth(1)
    c.roundRect(40, 30, 515, 55, 6, fill=1, stroke=1)
    
    c.setFillColor(primary)
    c.setFont('JPFont-Bold', 12)
    c.drawString(55, 62, "参加費用：完全無料（月1回開催）")
    
    c.setFont('JPFont', 9.5)
    c.setFillColor(text_dark)
    c.drawString(55, 43, "※ 参加条件：AWAKE公式Instagram（@awake_okinawa）のフォロワー様限定となります。")
    
    c.setFont('JPFont-Bold', 11)
    c.setFillColor(accent)
    c.drawRightString(width - 55, 52, "お申し込みは公式HPのメールフォームへ！")
    
    # ----------------------------------------------------
    # 7. Footer Logo / Brand Info
    # ----------------------------------------------------
    c.setFillColor(HexColor('#0b0f19'))
    c.rect(0, 0, width, 20, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('JPFont', 8)
    c.drawCentredString(width / 2.0, 6, "Copyright © 2026 Sprint Academy AWAKE. All Rights Reserved.")
    
    c.save()
    print(f"Successfully generated flyer PDF at: {pdf_path}")

if __name__ == "__main__":
    generate_pdf()
