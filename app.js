const addUser = document.querySelector('.btn-add');
const addModal = document.querySelector('.add-modal');
const tableUsers = document.querySelector('.table-users');
const addModalForm = document.querySelector('.add-modal .form');
const modalWrapper = document.querySelector('.modal-wrapper');

const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

let id;

//Create element and render the users
const renderUser = (doc) => {
    const tr = `
    <tr data-id=${doc.id}>
                    <td>${doc.data().firstName}</td>
                    <td>${doc.data().lastName}</td>
                    <td>${doc.data().email}</td>
                    <td>${doc.data().phoneNumber}</td>
                    <td>
                        <button class="btn btn-edit">Edit</button>
                        <button class="btn btn-delete">Delete</button>
                    </td>
                </tr>
    `;
    tableUsers.insertAdjacentHTML('beforeend', tr);

    //edit member
    const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
    btnEdit.addEventListener('click', () => {
        editModal.classList.add('modal-show');

        id = doc.id;
        editModalForm.firstName.value = doc.data().firstName;
        editModalForm.lastName.value = doc.data().lastName;
        editModalForm.email.value = doc.data().email;
        editModalForm.phoneNumber.value = doc.data().phoneNumber;
    });


    //Delete member
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    btnDelete.addEventListener('click', () => {
        db.collection('members').doc(`${doc.id}`).delete().then(() => {
            console.log('Document successfully deleted')
        }).catch((e) => console.log(e));
    })
}

//Click user add 
addUser.addEventListener('click', () => {
    addModal.classList.add('modal-show');

    addModalForm.firstName.value = '';
    addModalForm.lastName.value = '';
    addModalForm.phoneNumber.value = '';
    addModalForm.email.value = '';
})

//Click outside modal
window.addEventListener('click', e => {
    if (e.target === addModal) {
        addModal.classList.remove('modal-show')
    }
    if (e.target === editModal) {
        editModal.classList.remove('modal-show')
    }
});


db.collection('members').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderUser(change.doc);
        }
        if (change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);

            let tbody = tr.parentElement;
            tableUsers.removeChild(tbody);
        }
    });
})

//Click submit in add modal
addModalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('members').add({
        firstName: addModalForm.firstName.value,
        lastName: addModalForm.lastName.value,
        email: addModalForm.email.value,
        phoneNumber: addModalForm.phoneNumber.value
    });

    modalWrapper.classList.remove('modal-show');
});

editModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('members').doc(id).update({
        firstName: editModalForm.firstName.value,
        lastName: editModalForm.lastName.value,
        email: editModalForm.email.value,
        phoneNumber: editModalForm.phoneNumber.value
    });
    editModal.classList.remove('modal-show');
});