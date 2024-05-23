document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var materialboxes = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(materialboxes);
  });
  
  document.getElementById('submit-form-btn').addEventListener('click', function(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('first_name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email_input').value;
    const password = document.getElementById('password_input').value;
    
    if (!firstName || !surname || !email || !password) {
      M.toast({html: 'Please fill out all fields'});
      return;
    }
    
    const formData = {
      firstName,
      surname,
      email,
      password
    };
    
    fetch('/api/cats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response data:', data);  // Logging response data
      if (data.statusCode === 201) {
        M.toast({html: 'Cat added successfully!'});
        document.getElementById('first_name').value = '';
        document.getElementById('surname').value = '';
        document.getElementById('email_input').value = '';
        document.getElementById('password_input').value = '';
        var modal = M.Modal.getInstance(document.getElementById('form-modal'));
        modal.close();
      } else {
        M.toast({html: 'Failed to add cat'});
      }
    })
    .catch(error => {
      console.error('Error:', error);  // Logging error
      M.toast({html: 'Error occurred while adding cat'});
    });
  });
  