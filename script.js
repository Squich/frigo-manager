/* Select DOM elements */

const container = document.getElementById('container');
const date = document.getElementById('date');

const btnAdd = document.getElementById('btn-add');
const btnCloseAdd = document.getElementById('btn-close-add');

const currentDate = document.getElementById('current-date');
const empty = document.getElementById('empty');
const list = document.getElementById('list');
const btnDelete = document.querySelectorAll('.btn-delete');
const btnDeleteAll = document.getElementById('btn-delete-all');

const formAdd = document.getElementById('form');
const formTitle = document.getElementById('form-title');
const formName = document.getElementById('form-name');
const formDate = document.getElementById('form-date');
const formRecipe = document.getElementById('form-recipe');
const formOpened = document.querySelectorAll('input[name="opened"]');
const formOpenedYes = document.getElementById('opened-yes');
const formOpenedNo = document.getElementById('opened-no');
const btnSubmit = document.getElementById('btn-submit');

/* Variables */

let listItems, newItemName = '', newItemDate = '', newItemRecipe = '', newItemOpened = 'false', modifiedItemIndex = '';

/* One day in milliseconds */

const d = 1000 * 60 * 60 * 24;

/* Date formats */

const formatDateLong = date => `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
const formatDateShort = str => str.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$3/$2');

/* Generate startList */

const generateDate = num => formatDateLong(new Date(new Date().getTime() + num));

const startList = [
	{name:'Saumon', date:generateDate(-d * 9), recipe:'', opened:'true'},
	{name:'Fromage rapé', date:generateDate(-d * 3), recipe:'Omelette', opened:'false'},
	{name:'Crème fraiche', date:generateDate(0), recipe:'Chantilly', opened:'false'},
	{name:'Saucisses', date:generateDate(d * 2), recipe:'', opened:'true'},
	{name:'Lardons', date:generateDate(d * 2), recipe:'Salade composée', opened:'false'},
	{name:'Camembert', date:generateDate(d * 4), recipe:'', opened:'false'},
	{name:'Lait', date:generateDate(d * 5), recipe:'', opened:'false'},
	{name:'Pizza', date:generateDate(d * 7), recipe:'', opened:'true'},
	{name:'Gnocchis', date:generateDate(d * 10), recipe:'', opened:'false'}
]

/* Generate list with listItems */

function generateList() {

	getListItems();
	list.innerHTML = '';
	today();
	checkEmpty();

	listItems
		.sort((a, b) => new Date(a.date) - new Date(b.date))
		.forEach((item, i) => {

			/* Li */

			const listItem = document.createElement('li'); 
			listItem.dataset.index = i;
			listItem.innerHTML = `
			<span>
				<span class="smiley-container"></span>
				<span class="date">${formatDateShort(item.date)}</span>
				<span class="name">${item.name}</span>
			</span>
			<span>
				${item.recipe ? '<span class="recipe-container"><i class="icon-recipe fa fa-tags"></i></span>' : ''}
				<i class="btn-edit fa fa-pencil"></i>
				<i class="btn-delete fa fa-times"></i>
			</span>`;

			/* Tooltips */

			const tooltipDLC = document.createElement('div'); 
			tooltipDLC.className = 'tooltip';
			tooltipDLC.textContent = diff(item.date) + ' jr' + (item.opened == 'false' ? '' : ' (entamé)');
			listItem.querySelector('.smiley-container').prepend(tooltipDLC);

			if (item.recipe) {
				const tooltipRecipe = document.createElement('div'); 
				tooltipRecipe.className = 'tooltip';
				tooltipRecipe.textContent = item.recipe;
				listItem.querySelector('.recipe-container').append(tooltipRecipe);
			}
			
			/* Smiley */

			const smiley = document.createElement('i'); 
			smiley.className = 'smiley fa ' + chooseSmiley(item.opened == 'false' || !item.opened ? diff(item.date) : Infinity) + ' ' + colorizeSmiley(diff(item.date));
			listItem.querySelector('.smiley-container').prepend(smiley);

			list.appendChild(listItem);

		});
		
	console.log(listItems);
}

/* Set and Get from Local Storage */

const setListItems = () => localStorage.setItem('listItems', JSON.stringify(listItems));
const getListItems = () => listItems = JSON.parse(localStorage.getItem('listItems')) || startList;

/* Display a message if the list is empty */

const checkEmpty = () => listItems.length ? (empty.classList.remove('active'), btnDeleteAll.classList.add('active')) : (empty.classList.add('active'), btnDeleteAll.classList.remove('active'));

/* Delete ​​variables values and close the window */

const clearAndClose = () => {
	modifiedItemIndex = '';
	newItemName = '';
	newItemDate = '';
	newItemRecipe = '';
	newItemOpened = 'false';
	formAdd.reset();
	container.classList.remove('add-active')
}

/* Generate the current date */

const today = () => date.textContent = formatDateShort(formatDateLong(new Date()));

/* Calculate the number of days between a DLC and today */

const diff = date => Math.ceil((new Date(date) - new Date()) / d);

/* Choose and colorize the icon of the elements according to the remaining time and the Opened setting */

const chooseSmiley = num => num < 0 ? 'fa-frown-o' : num < 4 ? 'fa-meh-o' : num === Infinity ? 'fa-exclamation' : 'fa-smile-o';
const colorizeSmiley = num => num < 0 ? 'black' : num < 2 ? 'red' : num < 4 ? 'orange' : 'green';

/* Check the radio buttons */

const checkIfOpened = () => newItemOpened == 'true' ? formOpenedYes.checked = true : formOpenedNo.checked = true;

/* Display Panel Add */

btnAdd.addEventListener('click', () => {
	formTitle.innerHTML = 'Ajouter un produit';
	btnSubmit.innerHTML = '<i class="fa fa-plus"></i>Ajouter';
	checkIfOpened();
	container.classList.add('add-active');
});
btnCloseAdd.addEventListener('click', clearAndClose);

/* Events on the icons of each item in the list */

list.addEventListener('click', e => {
	
	const index = e.target.parentElement.parentElement.dataset.index;

	/* Activate the tooltip for remaining days or the tooltip for the specified recipe */
	if (e.target.classList.contains('smiley') || e.target.classList.contains('icon-recipe')) {
		e.target.classList.add('active');
		window.setTimeout(() => e.target.classList.remove('active'), 1000);
	}

	/* Edit one item in the list */
	if (e.target.classList.contains('btn-edit')) {

		formTitle.innerHTML = 'Modifier un produit';
		btnSubmit.innerHTML = '<i class="fa fa-pencil"></i>Modifier';

		newItemName = listItems[index].name;
		newItemDate = listItems[index].date;
		newItemRecipe = listItems[index].recipe;
		newItemOpened = listItems[index].opened;

		formName.value = listItems[index].name;
		formDate.value = listItems[index].date;
		formRecipe.value = listItems[index].recipe || '';
		checkIfOpened();

		container.classList.add('add-active');
		modifiedItemIndex = index;
		
	}
	
	/* Delete one item in the list */	
	if (e.target.classList.contains('btn-delete')) {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
			listItems.splice(index, 1);
			setListItems();
			generateList();
		}
	}
	
});

/* Delete the whole list */

btnDeleteAll.addEventListener('click', () => {
	if (window.confirm('Êtes-vous sûr de vouloir supprimer toute la liste ?')) {
		listItems.splice(0,listItems.length);
		setListItems();
		generateList();
	}
});

/* Add item to list */

formName.addEventListener('keyup', () => newItemName = formName.value.trim());
formName.addEventListener('change', () => newItemName = formName.value.trim());
formDate.addEventListener('change', () => newItemDate = formDate.value);
formRecipe.addEventListener('keyup', () => newItemRecipe = formRecipe.value.trim());
formRecipe.addEventListener('change', () => newItemRecipe = formRecipe.value.trim());
formOpened.forEach(btn => btn.addEventListener('change', () => newItemOpened = btn.value));

btnSubmit.addEventListener('click', e => {
	e.preventDefault();
	if (newItemName == '' || newItemDate == '') {
		alert('Vous devez renseigner le nom et la DLC du produit à ajouter.');
	} else {
		if (modifiedItemIndex) listItems.splice(modifiedItemIndex, 1);
		listItems.push({name:newItemName, date:newItemDate, recipe:newItemRecipe, opened:newItemOpened});
		setListItems();
		generateList();
		clearAndClose();
	}
});

/* Start */

generateList();