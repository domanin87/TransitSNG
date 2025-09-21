<!-- patches/ui_snippets.md -->
### Main page: 6-8 card placeholders (Jinja2)
<div class="cards">
  {% for card in range(6) %}
  <div class="card {{ 'dark' if theme == 'dark' else '' }}">
    <h3>Card {{ loop.index }}</h3>
    <p>Placeholder content...</p>
  </div>
  {% endfor %}
</div>

### Dark theme
Add to your base template:
<body class="{{ 'theme-dark' if theme == 'dark' else 'theme-light' }}">
  <!-- Toggle -->
  <a href="{{ url_for('toggle_theme') }}">Toggle theme</a>
</body>

### News block
<section id="news">
  <h2>News</h2>
  {% for item in news %}
  <article>
    <h3>{{ item.title }}</h3>
    <p>{{ item.content[:200] }}...</p>
  </article>
  {% endfor %}
</section>

### Vacancies block
<section id="vacancies">
  <h2>Vacancies</h2>
  {% for v in vacancies %}
  <div class="vacancy">
    <h4>{{ v.title }}</h4>
    <p>{{ v.description[:200] }}</p>
  </div>
  {% endfor %}
</section>
