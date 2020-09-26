const addUser = document.querySelector('.btn-add');
const addModal = document.querySelector('.add-modal');
const tableUsers = document.querySelector('.table-users');
const addModalForm = document.querySelector('.add-modal .form');
const modalWrapper = document.querySelector('.modal-wrapper');


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
})

//Click outside modal
window.addEventListener('click', e => {
    if (e.target === addModal) {
        addModal.classList.remove('modal-show')
    }
})

//Get All Users
db.collection('members').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
        console.log(doc.data())
        renderUser(doc);
    })
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
})