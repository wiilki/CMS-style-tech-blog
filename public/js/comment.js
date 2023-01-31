const commentFormHandler = async (event) => {
    event.preventDefault();

    const body = document.querySelector('#').value.trim();

    if (body) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({ body }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert('Failed to create post');
        }
    }
};

document
    .querySelector('.new-post-form')
    .addEventListener('submit', commentFormHandler);
