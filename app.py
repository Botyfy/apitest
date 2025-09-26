from flask import Flask, request, render_template, redirect

app = Flask(__name__)

# In-memory storage for submitted texts
text_storage = []

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_text = request.form.get('user_text', '').strip()
        if user_text:
            text_storage.append(user_text)
        return redirect('/')
    return render_template('index.html', texts=text_storage)

if __name__ == '__main__':
    app.run(debug=True)
