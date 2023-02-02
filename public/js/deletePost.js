const delButtonHandler = async (event) => {
  event.preventDefault();

  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({
      post_id: id,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    document.location.replace('/dashboard/');
  } else {
    alert(response.statusText);
  }
};

document
  .querySelector('.post-list')
  .addEventListener('click', delButtonHandler);
