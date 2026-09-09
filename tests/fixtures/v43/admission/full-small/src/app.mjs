import { slug } from './slug.mjs';
document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#result').textContent = slug(document.querySelector('#title').value);
});
