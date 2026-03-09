import re

def convert_markdown_to_html(md_path, html_path):
    with open(md_path, 'r') as f:
        content = f.read()

    # --- Basic Markdown to HTML Conversion (Regex-based since no external deps guaranteed) ---
    
    # Header 1 (Title)
    content = re.sub(r'^# (.*)$', r'<h1 class="article-title">\1</h1>', content, flags=re.MULTILINE)
    
    # Header 2 (Sections) - SQ uses Roman Numerals usually, or standard caps
    content = re.sub(r'^## (.*)$', r'<h2>\1</h2>', content, flags=re.MULTILINE)
    
    # Header 3 (Subsections)
    content = re.sub(r'^### (.*)$', r'<h3>\1</h3>', content, flags=re.MULTILINE)
    
    # Bold / Italic
    content = re.sub(r'\*\*\*(.*?)\*\*\*', r'<hr class="section-break">', content) # HR
    content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
    content = re.sub(r'\*(.*?)\*', r'<em>\1</em>', content)
    
    # Blockquotes (Figures in this context)
    # Transforming > **Figure X.** ... into a figure div
    def figure_replacer(match):
        text = match.group(1)
        # Check if it starts with **Figure
        if text.strip().startswith('<strong>Figure'):
            return f'<div class="figure-box">{text}</div>'
        return f'<blockquote>{text}</blockquote>'
    
    content = re.sub(r'^> (.*)$', figure_replacer, content, flags=re.MULTILINE)

    # Lists
    # Simple bullet list support
    content = re.sub(r'^\* (.*)$', r'<ul><li>\1</li></ul>', content, flags=re.MULTILINE)
    # Fix adjacent lists (very crude, but works for simple cases)
    content = content.replace('</ul>\n<ul>', '')
    
    # Paragraphs (blank lines)
    paragraphs = content.split('\n\n')
    html_paragraphs = []
    for p in paragraphs:
        if p.strip().startswith('<h') or p.strip().startswith('<div') or p.strip().startswith('<hr') or p.strip().startswith('<ul') or p.strip().startswith('<block'):
            html_paragraphs.append(p)
        else:
            if p.strip():
                html_paragraphs.append(f'<p>{p.strip()}</p>')
            
    body_content = '\n'.join(html_paragraphs)

    # Footnotes (simple regex for [^n])
    # Convert [^n] in text to superscripts
    body_content = re.sub(r'\[\^(\d+)\]', r'<sup class="footnote-ref"><a href="#fn\1">\1</a></sup>', body_content)
    
    # Convert the Notes section at the end
    # Find the "Notes" section (last part usually)
    if "Notes" in body_content:
        parts = body_content.split('<h2>Notes</h2>')
        if len(parts) > 1:
            main_text = parts[0]
            notes_text = parts[1]
            
            # Formalize notes list
            notes_html = '<div class="notes-section"><h2>Notes</h2><ol>'
            # Extract individual notes: [^1]: ...
            # Regex for the note definition: <p>[^1]: Content...</p> or similar
            # Since we wrapped in <p>, it might look like <p>[^1]: ...</p>
            
            # Let's re-process the notes part specifically
            # It's safer to rely on the regex for the note pattern in the raw text maybe? 
            # But we already paragraph-ized it.
            
            # Simple cleanup for the specific format we know we wrote
            notes_lines = re.findall(r'<p>\[\^(\d+)\]:\s*(.*?)</p>', notes_text, re.DOTALL)
            for num, note_content in notes_lines:
                notes_html += f'<li id="fn{num}">{note_content} <a href="#fnref{num}">↩</a></li>'
            notes_html += '</ol></div>'
            
            body_content = main_text + notes_html

    # LaTeX Math (simple replacement for display)
    body_content = body_content.replace(r'$\rho$', '<em>ρ</em>')
    body_content = body_content.replace(r'$p < 10^{-40}$', '<em>p</em> < 10<sup>-40</sup>')
    # ... add other specific replacements if needed, or generic
    body_content = re.sub(r'\$(.*?)\$', r'<span class="math">\1</span>', body_content)

    # --- HTML Template ---
    html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>The Wandering Filament - Shakespeare Quarterly Mockup</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        
        body {{
            font-family: 'Crimson Text', 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max_width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: #fff;
        }}
        
        @page {{
            size: letter;
            margin: 1in;
            @top-center {{
                content: "SHAKESPEARE QUARTERLY";
                font-family: 'Crimson Text', serif;
                font-size: 9pt;
                font-variant: small-caps;
            }}
            @bottom-center {{
                content: counter(page);
                font-family: 'Crimson Text', serif;
                font-size: 10pt;
            }}
        }}

        /* Typography */
        h1.article-title {{
            font-size: 24pt;
            text-align: center;
            font-weight: normal;
            margin-bottom: 0.5em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        .author-name {{
            text-align: center;
            font-size: 12pt;
            font-variant: small-caps;
            margin-bottom: 2em;
            display: block;
            width: 100%;
        }}
        
        h2 {{
            font-size: 14pt;
            font-variant: small-caps;
            text-align: center;
            margin-top: 2em;
            margin-bottom: 1em;
            font-weight: normal;
            border-bottom: 1px solid #ddd;
            padding-bottom: 0.5em;
            display: inline-block;
            min-width: 50%;
            margin-left: 25%;
        }}
        
        h3 {{
            font-size: 12pt;
            font-style: italic;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            font-weight: normal;
        }}
        
        p {{
            text-align: justify;
            text-indent: 2em;
            margin-bottom: 0;
            margin-top: 0;
        }}
        
        p + p {{
            margin-top: 0;
        }}
        
        /* First paragraph after header - no indent */
        h1 + p, h2 + p, h3 + p {{
            text-indent: 0;
        }}

        blockquote {{
            margin: 1.5em 2em;
            font-size: 11pt;
        }}
        
        /* Figures */
        .figure-box {{
            border: 1px solid #ccc;
            padding: 15px;
            margin: 2em 0;
            background: #f9f9f9;
            font-family: sans-serif;
            font-size: 0.9em;
            text-align: center;
            page-break-inside: avoid;
        }}
        
        .figure-box strong {{
            font-family: 'Crimson Text', serif;
            font-weight: bold;
            font-variant: small-caps;
        }}
        
        /* Notes */
        .notes-section {{
            margin-top: 3em;
            border-top: 1px solid #333;
            padding-top: 1em;
            font-size: 10pt;
        }}
        
        .notes-section h2 {{
            text-align: left;
            margin-left: 0;
            border: none;
            font-size: 12pt;
        }}
        
        .notes-section ol {{
            padding-left: 1.5em;
        }}
        
        .notes-section li {{
            margin-bottom: 0.5em;
            text-align: left;
        }}
        
        sup.footnote-ref {{
            font-size: 0.7em;
            vertical-align: super;
        }}
        
        a {{
            color: inherit;
            text-decoration: none;
        }}
        
        /* Abstract styling */
        .abstract {{
            font-size: 10pt;
            margin: 2em 4em;
            text-align: justify;
            text-indent: 0;
        }}
        
        hr.section-break {{
            border: 0;
            text-align: center;
            margin: 2em 0;
        }}
        hr.section-break:after {{
            content: "***";
            font-size: 14pt;
        }}

    </style>
</head>
<body onload="window.print()">

    {body_content}

</body>
</html>
    """
    
    with open(html_path, 'w') as f:
        f.write(html_template)
    print(f"Successfully converted {md_path} to {html_path}")

if __name__ == "__main__":
    convert_markdown_to_html(
        "/Users/joelfarthing/Library/Mobile Documents/com~apple~CloudDocs/Documents/Filament_Local_Mac/shakespeare_quarterly_mockup.md",
        "/Users/joelfarthing/Library/Mobile Documents/com~apple~CloudDocs/Documents/Filament_Local_Mac/shakespeare_quarterly_mockup.html"
    )
