from flask import Flask, send_from_directory
from flask_mako import MakoTemplates, render_template

app = Flask(__name__, static_url_path='')
app.template_folder = "public"
mako = MakoTemplates(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>.html')
def catch_all(path):
    path = path.split("?")[0]
    return render_template(path+".html")


@app.route('/resources/<path:path>')
def get_static(path):
    return send_from_directory('public/resources', path)

@app.route('/')
def get_index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
