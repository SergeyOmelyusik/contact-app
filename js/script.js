class User {

    constructor(obj) {

        this.data = {
            id: obj.id ||0,
            name: obj.name || '--',
            email: obj.email || '--',
            address:  obj.address || '--',
            phone:  obj.phone || '--'
        }

    }

        edit(obj) {
            this.data.id = obj.id;
            this.data.name = obj.name;
            this.data.email = obj.email;
            this.data.address = obj.address;
            this.data.phone = obj.phone;
        }

        get() {
            return this.data;
        }
    
}

class Contacts {

    data = new Array();
    lastId = 0;

    add(obj) {
        let user = new User(obj);
        user.data.id = ++this.lastId;
        this.data.push(user);
    }

    remove(id) {
        this.data.forEach((user,i) => {
            if(user.data.id == id) {
                this.data.splice(i,1)
            }
        });
    }

    edit(id, obj) {
        let editUser;
        this.data.forEach(user => {
            if(user.data.id == id) editUser = user;
        })

        editUser.edit(obj);
    }

    get() {
        return this.data;
    }

}

class ContactsApp extends Contacts {

    elem = document.createElement('div');
    body = document.body;
   
    constructor() {
        super();

       if(!this.storage || this.storage.length == 0) {
           this.getData().then((arr) => {
            arr.forEach((item) => {
                this.add(item);
                this.get();
            });
        });
        this.init();
        
       }
       
    }

    onAdd() {

        let contact = {};

        let form = document.querySelector('.add__form');

        contact.name = document.querySelector('.name').value;
        contact.address = document.querySelector('.address').value;

        let phone = document.querySelector('.phone').value;   

        const validateNumber = function(number) {
            var regexp = /^(\+)?((\d{2,3}))(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}$/; 
            return regexp.test(number);
        }

        if (validateNumber(phone) == true) {
            contact.phone = phone;
        } else {
            alert('Invalide Phone! Please try again')
            form.classList.remove('hidden');
            return;
        }
        
        let email = document.querySelector('.email').value;

        const validateEmail = function(email) {
            var str = /([A-Za-z0-9_\-\.]{3,})+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,12})$/;
    
            return str.test(email);
        }

        if (validateEmail(email) == true) {
            contact.email = email;
        } else {
            alert('Invalide Email! Please try again')
            form.classList.remove('hidden');
            return;
        }    

        document.querySelector('.name').value = "";
        document.querySelector('.address').value = "";
        document.querySelector('.email').value = "";
        document.querySelector('.phone').value = "";

        super.add(contact);
        
    };

    onEdit(editItem) {
       
        let editForm = document.querySelector('.edit__form');

        let editedContact = {};

        let id = editItem;

        editedContact.id = id;
        editedContact.name = editForm.querySelector('.name').value;
        editedContact.address = editForm.querySelector('.address').value;
        editedContact.email = editForm.querySelector('.email').value;
        editedContact.phone = editForm.querySelector('.phone').value;

        super.edit(id, editedContact);
        this.get();
    }

    onRemove() {
        let deleteItem = event.target.closest('.contact__item');
        let id = deleteItem.dataset.id;
        super.remove(id);
        this.get();
    }

    get() {

        let contactsInfo = super.get();

        let contacts = document.querySelector('.contacts');

        while(contacts.firstChild) {
            contacts.removeChild(contacts.firstChild);
        }

        contactsInfo.forEach(item =>  this.show(item));

        this.storage = contactsInfo;
    }

    show(item) {
        
        let contactItem = document.createElement('div');
        contactItem.classList.add('contact__item');

        contactItem.setAttribute('data-id', item.data.id);
        contactItem.classList.add('contact__item');

        let content = document.createElement('div');
        content.classList.add('contact__item__content');

        let buttons = document.createElement('div');
        buttons.classList.add('contact__item__buttons');
        
        let editBtn = document.createElement('div');
        editBtn.classList.add('edit__btn');

        let deleteBtn = document.createElement('div');
        deleteBtn.classList.add('delete__btn');
        
        buttons.append(editBtn,deleteBtn);
        contactItem.append(content,buttons);

        content.innerHTML = `<h3> Name: <span>${item.data.name}</span> </br>Phone: <span>${item.data.phone}</span> </h3> email: <span>${item.data.email}</span>;   address: <span>${item.data.address}</span> </br>`;

        document.querySelector('.contacts').append(contactItem);

        editBtn.addEventListener('click', (event) => {
            let editPopup = document.createElement('div');
            editPopup.classList.add('edit__popup');
            document.body.append(editPopup);
            editPopup.innerHTML = `
            <div class = "popup__modal">
                <div class = "close__popup">X</div>
                <div class="edit__form">
                    <form action="#" >
                        <div>Name<input type="text" class="name" name="name" value = "${item.data.name}"></div>
                        <div>Phone<input type="tel" class="phone" name = "phone" value = "${item.data.phone}"></div>
                        <div>Address<input type="text" class="address" name="address" value = "${item.data.address}"></div>
                        <div>E-mail<input type="email" class="email" name="email" value = "${item.data.email}"></div>
                        <button class="save">save</button>
                    </form>
                </div>
            </div>`;

            let popupClose = document.querySelector('.close__popup');
            popupClose.addEventListener('click', function(event){
                editPopup.remove();
            });

            let editItem = event.target.closest('.contact__item').dataset.id;
            

            let saveBtn = document.querySelector('.save');

            saveBtn.addEventListener('click', (event) => {
                event.preventDefault()
                this.onEdit(editItem);
                this.get();

                let message = document.createElement('p');
                message.classList.add('done');
                message.innerHTML='Changes saved successfully';

                let popupModal = document.querySelector('.popup__modal');

                popupModal.append(message);

                const removeMsg  = function() {
                    message.remove();
                    editPopup.remove();
                }

                setTimeout(removeMsg, 1000);
            }); 
        });

        deleteBtn.addEventListener('click', (event) => this.onRemove());
    }

     getCookie(name) {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
      }

    setCookie(name, value, options = {}) {

        options = {
          path: '/',
          // при необходимости добавьте другие значения по умолчанию
          ...options
        };
      
        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        }
      
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      
        for (let optionKey in options) {
          updatedCookie += "; " + optionKey;
          let optionValue = options[optionKey];
          if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
          }
        }
      
        document.cookie = updatedCookie;
      }

    set storage(contactsInfo) {
        localStorage.setItem('contactsLocalData', JSON.stringify(contactsInfo));

        this.setCookie('localDataExp', 1, {'max-age': 10000});
    }

    get storage() {
        let locData = localStorage.getItem('contactsLocalData');
        if(!locData) return [];
        return JSON.parse(locData);
    }

    async getData() {
        let url = 'https://jsonplaceholder.typicode.com/users'
        let responce = await fetch(url);
        let responseData = await responce.json();
        let data = responseData.map((item) => {
            return {  
                name: item.name,
                phone: item.phone,
                email: item.email,
                address:
                    item.address.city +
                    item.address.street +
                    item.address.suite,
            };
        });
        return data;
    }

    init() {

        this.elem.classList.add('container')
        this.body.append(this.elem);

        this.elem.innerHTML = `
        <div class="contacts__header">
            <h1>ContactsApp</h1>
            <div class="btn_add"></div>
        </div>

        <div class="add__form hidden">
            <form action="#" >
           
                <div class="field">Name<input  type="text" class="name" name="name"></div>
                <div class="field">Phone<input type="tel" class="phone" name = "phone"></div>
                <div class="field">Address<input type="text" class="address" name="address"></div>
                <div class="field">Email<input type="email" class="email" name="email"></div>
                <button class="btn__added">add</button>
            </form>
        </div>
        <div class="contacts"></div>`;
        let btnAdd = document.querySelector('.btn_add');
        let btnAdded = document.querySelector('.btn__added');
        let form = document.querySelector(".add__form");
        let msg = document.querySelector('.validate__msg');
       
        btnAdd.addEventListener('click', function() {
            form.classList.toggle('hidden')}) ;
            
        btnAdded.addEventListener('click', (event) => {
            event.preventDefault()
            form.classList.add('hidden');

            this.onAdd(event);
            this.get();
        });

        let localData = this.storage;

        let localDataExp = this.getCookie('localDataExp');

        if(!localDataExp) this.storage = [];
        
        if(localData.length > 0) {
            this.storage.forEach(contact => {
                this.add(contact.data)
            }
            ) 
        } 
        this.get(); 
    };
    
}

let contact = new ContactsApp();
contact.init();





