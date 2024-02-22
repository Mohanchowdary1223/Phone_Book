import React, { useEffect, useState } from 'react';

const App = () => {
    const [pressed, setPressed] = useState(false);
    const [contactPressed, setContactPressed] = useState(false);
    const [editPressed, setEditPressed] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [submitName, setSubmitName] = useState('');
    const [updateName, setUpdateName] = useState('');
    const [submitPhone, setSubmitPhone] = useState('');
    const [updatePhone, setUpdatePhone] = useState('');
    const [data, setData] = useState([]);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupMessageE, setPopupMessageE] = useState('');
    const [deletingContactId, setDeletingContactId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleAdd = () => {
        setPressed(true);
    };

    const dismissDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
    };

    const handleEditPressed = (contact) => {
        setSelectedContactId(contact._id);
        setUpdateName(contact.name);
        setUpdatePhone(contact.phone);
        setPressed(false);
        setEditPressed(true);
    };

    const handleSubmitNameChange = (e) => {
        const inputName = e.target.value;
        const truncatedName = inputName.slice(0, 20);
        setSubmitName(truncatedName);
    };

    const handleUpdateNameChange = (e) => {
        const inputName = e.target.value;
        const truncatedName = inputName.slice(0, 20);
        setUpdateName(truncatedName);
    };

    const fetchData = () => {
        fetch('/fetchData')
            .then((response) => response.json())
            .then((result) => setData(result));
    };

    const handleSubmitPhoneNumberChange = (e) => {
        const inputPhoneNumber = e.target.value;
        const validatedPhoneNumber = inputPhoneNumber.replace(/\D/g, '').slice(0, 10);
        setSubmitPhone(validatedPhoneNumber);
    };

    const handleUpdatePhoneNumberChange = (e) => {
        const inputPhoneNumber = e.target.value;
        const validatedPhoneNumber = inputPhoneNumber.replace(/\D/g, '').slice(0, 10);
        setUpdatePhone(validatedPhoneNumber);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Name:', submitName);
        console.log('Phone Number:', submitPhone);
        fetch('/addPhone', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: submitName, phone: submitPhone }),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                fetchData();
                setSubmitName('');
                setSubmitPhone('');
                setPressed(false);
                setContactPressed(true);
                setPopupMessage('Contact saved successfully!');
                setTimeout(() => {
                    setPopupMessage('');
                }, 2000);
            })
            .catch((error) => {
                console.error('Error adding contact:', error);
            });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        console.log('Name:', updateName);
        console.log('Phone Number:', updatePhone);
        fetch(`/update/${selectedContactId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: updateName, phone: updatePhone }),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                fetchData();
                setEditPressed(false);
                setPopupMessageE('Contact updated successfully!');
                setTimeout(() => {
                    setPopupMessageE('');
                }, 2000);
                setUpdateName('');
                setUpdatePhone('');
            })
            .catch((error) => {
                console.error('Error updating contact:', error);
            });
    };

    const handleGoBack = () => {
        setPressed(false);
        setContactPressed(false);
    };

    const handleContacts = () => {
        setPressed(false);
        setContactPressed(true);
    };

    const handleDelete = (id) => {
        setDeletingContactId(id);
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        fetch('/delete/' + deletingContactId, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((result) => {
                fetchData();
                console.log(result);
                setShowDeleteConfirmation(false);
                setPopupMessageE('Contact deleted successfully!');
                setTimeout(() => {
                    setPopupMessageE('');
                }, 2000);
            });
    };

    const cancelDelete = () => {
        setDeletingContactId(null);
        setShowDeleteConfirmation(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="pb">
            {pressed ? (
                <div className="phone_book_main">
                    <h1 className="pb13">Add contact</h1>
                    <div className="phone_book_main13">
                        <div className="c-f">
                            <form onSubmit={handleSubmit}>
                                <label className="name-main">
                                    Name <br />
                                    <input
                                        type="text"
                                        value={submitName}
                                        onChange={handleSubmitNameChange}
                                        placeholder="Enter name"
                                        required
                                        className="name-box"
                                    />
                                    <br />
                                </label>
                                <label className="number-main">
                                    Number <br />
                                    <input
                                        type="tel"
                                        value={submitPhone}
                                        onChange={handleSubmitPhoneNumberChange}
                                        placeholder="Enter phone number"
                                        pattern="[0-9]+"
                                        className="number-box"
                                        minLength={10}
                                        maxLength={10}
                                        required
                                    />
                                    <br />
                                </label>
                                <button type="submit" className="phone_book_button11">Save</button>
                            </form>
                        </div>
                    </div>
                    <div></div>
                    <div className="home-icon1" onClick={handleGoBack}>
                        <i className="fa-solid fa-house fa-xl"></i>
                    </div>
                    <div className="serch-icon1" onClick={handleContacts}>
                        <i className="fa-solid fa-user fa-xl"></i>
                    </div>
                </div>
            ) : contactPressed ? (
                editPressed ? (
                    <div className="phone_book_main">
                        <h1 className="pb11">EDIT CONTACT</h1>
                        <div className="phone_book_main1">
                            <div className="c-f">
                                <form onSubmit={handleEdit}>
                                    <label className="name-main">
                                        Enter Name <br />
                                        <input
                                            type="text"
                                            value={updateName}
                                            onChange={handleUpdateNameChange}
                                            placeholder="Edit Name"
                                            required
                                            className=" name-box"
                                        />
                                    </label>
                                    <br />
                                    <label className="number-main">
                                        Edit Number <br />
                                        <input
                                            type="tel"
                                            value={updatePhone}
                                            onChange={handleUpdatePhoneNumberChange}
                                            placeholder="Enter Phone Number"
                                            pattern="[0-9]{10}"
                                            minLength={10}
                                            maxLength={10}
                                            className="number-box"
                                        />
                                    </label>
                                    <br />
                                    <button type="submit" className="e-s">Save</button>
                                    <button type="button" className="e-c" onClick={() => setEditPressed(false)}>
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="phone_book_main-c">
                        <h1 className="pb11">CONTACTS</h1>
                        <div>
                            <div className="p-t">
                                <table>
                                    <thead>
                                        <tr>
                                            <th className="text-data">Name</th>
                                            <th className="text-data">Number</th>
                                            <th className="text-data"> </th>
                                            <th className="text-data"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((result, key) => (
                                            <tr key={key}>
                                                <td>{result.name}</td>
                                                <td>{result.phone}</td>
                                                <td className="edit-icon" onClick={() => handleEditPressed(result)}>
                                                    <i className="fa-solid fa-user-pen fa-lg" onClick={dismissDeleteConfirmation}></i>
                                                </td>
                                                <td className="delet-icon" onClick={() => handleDelete(result._id)}>
                                                    <i className="fa-solid fa-trash fa-lg"></i>
                                                </td>
                                            </tr>
                                        ))} 
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {popupMessage && <div className="popup-message">{popupMessage}</div>}
                        {popupMessageE && <div className="popup-message">{popupMessageE}</div>}
                        <div className="t-c">Total contacts:<span>{data.length}</span></div>
                        <div className="home-icon" onClick={handleGoBack}>
                            <i className="fa-solid fa-house fa-xl" onClick={dismissDeleteConfirmation}></i>
                        </div>
                        <div className="serch-icon" onClick={handleAdd}>
                            <i className="fa-solid fa-user-plus fa-xl" onClick={dismissDeleteConfirmation}></i>
                        </div>
                    </div>
                )
            ) : (
                <div className="phone_book_main">
                    <h1 className="pb1">Phone Book</h1>
                    <div className="phone_book_main1">
                        <div className="phone_book_main11">
                            <h2>Hello...👋</h2>
                            <h5>This phone Book helps to save all your contacts..</h5>
                            <h5>click here to add contact...👇</h5>
                            <div className="phone_add_icon" onClick={handleAdd}>
                                <i className="fa-solid fa-user-plus fa-xl"></i>
                            </div>
                        </div>
                        <div className="phone_book_main12">
                            <h5>Also you can find all the contacts in this Phone book</h5>
                            <h5>Click here to find the contacts...👇</h5>
                            <div className="phone_contact_icon" onClick={handleContacts}>
                                <i className="fa-solid fa-user fa-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteConfirmation && (
                <div className="delete-confirmation">
                    <div>
                    <p className='d-p'>Are you sure you want to delete this contact?</p> 
                    <div className='y-n-button'>
                    <button onClick={confirmDelete} className='yes-button'>Yes</button>
                    <button onClick={cancelDelete} className='no-button'>No</button>
                    </div>
                    
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default App;
