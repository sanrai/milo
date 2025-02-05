import { decorateButtons } from '../../utils/decorate.js';
import { loadStyle } from '../../utils/utils.js';

const HALF = 'OneHalfCard';
const HALF_HEIGHT = 'HalfHeightCard';
const PRODUCT = 'ProductCard';
const DOUBLE_WIDE = 'DoubleWideCard';

const getCardType = (styles) => {
  const cardTypes = {
    'half-card': HALF,
    'half-height-card': HALF_HEIGHT,
    'product-card': PRODUCT,
    'double-width-card': DOUBLE_WIDE,
  };
  const authoredType = styles?.find((style) => style in cardTypes);
  return cardTypes[authoredType] || HALF;
};

const addWrapper = (el, section, cardType) => {
  const { classList } = section;
  const gridCl = 'consonant-CardsGrid';

  if (!classList.contains('consonant-Wrapper')) {
    const up = Array.from(classList).find((style) => style.includes('-up'))?.replace('-', '') || '3up';
    const innerWrapper = `<div class="consonant-Wrapper-inner">
      <div class="consonant-Wrapper-collection">
        <div class="${gridCl} ${gridCl}--${up} ${gridCl}--with4xGutter${cardType === DOUBLE_WIDE ? ` ${gridCl}--doubleWideCards` : ''}">
        </div>
      </div>
    </div>`;

    classList.add('consonant-Wrapper', 'consonant-Wrapper--1200MaxWidth');
    section.insertAdjacentHTML('afterbegin', innerWrapper);
  }

  section.querySelector(`.${gridCl}`).append(el);
};

const addBackgroundImg = (picture, cardType, card) => {
  const url = picture.querySelector('img').src;
  const imageDiv = document.createElement('div');

  imageDiv.style.backgroundImage = `url(${url})`;
  imageDiv.classList.add(`consonant-${cardType}-img`);
  card.append(imageDiv);
};

const addInner = (el, cardType, card) => {
  const title = el.querySelector('h1, h2, h3, h4, h5, h6');
  const text = Array.from(el.querySelectorAll('p'))?.find((p) => !p.querySelector('picture, a'));
  let inner = el.querySelector(':scope > div:not([class])');

  if (cardType === DOUBLE_WIDE) {
    inner = document.createElement('a');
    inner.href = el.querySelector('a')?.href || '';
    inner.rel = 'noopener noreferrer';
    inner.tabIndex = 0;
    if (title) inner.append(title);
    if (text) inner.append(text);
    el.querySelector(':scope > div:not([class])')?.remove();
  }

  inner.classList.add(`consonant-${cardType}-inner`);
  card.append(inner);

  if (cardType === PRODUCT) {
    inner.querySelector(':scope > div')?.classList.add('consonant-ProductCard-row');
    if (text) inner.append(text);
  }

  if (cardType === HALF_HEIGHT) {
    text?.remove();
    el.remove();
  }

  title?.classList.add(`consonant-${cardType}-title`);
  text?.classList.add(`consonant-${cardType}-text`);
};

const addFooter = (links, container) => {
  const linksArr = Array.from(links);
  const linksLeng = linksArr.length;
  let footer = `<div class="consonant-CardFooter"><div class="consonant-CardFooter-row" data-cells="${linksLeng}">`;
  footer = linksArr.reduce(
    (combined, link, index) => (
      `${combined}<div class="consonant-CardFooter-cell consonant-CardFooter-cell--${(linksLeng === 2 && index === 0) ? 'left' : 'right'}">${link.outerHTML}</div>`),
    footer,
  );
  footer += '</div></div>';

  container.insertAdjacentHTML('beforeend', footer);
  links[0]?.parentElement?.remove();
};

const init = (el) => {
  const section = el.closest('.section');
  const row = el.querySelector(':scope > div');
  const picture = el.querySelector('picture');
  const links = el.querySelectorAll('a');
  const styles = Array.from(el.classList);
  const cardType = getCardType(styles);
  const version = new URL(document.location.href)?.searchParams?.get('caasver') || 'latest';
  let card = el;

  loadStyle(`https://www.adobe.com/special/chimera/${version}/dist/dexter/app.min.css`);
  addWrapper(el, section, cardType);

  if (cardType === HALF_HEIGHT) {
    card = document.createElement('a');
    card.href = links[0]?.href || '';
    card.className = el.className;

    el.insertAdjacentElement('beforebegin', card);
    links[0]?.parentElement?.remove();
  }

  card.classList.add('consonant-Card', `consonant-${cardType}`);
  if (!styles.includes('border')) card.classList.add('consonant-u-noBorders');

  if (picture && cardType !== PRODUCT) {
    addBackgroundImg(picture, cardType, card);
  }

  picture?.parentElement.remove();
  addInner(el, cardType, card);
  decorateButtons(el);

  if (cardType === HALF || cardType === PRODUCT) {
    addFooter(links, row);
  }
};

export default init;
