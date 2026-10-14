document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) {
        return;
    }

    var statusBox = document.getElementById('form-status');
    var submitButton = document.getElementById('submit-button');

    function getFeedback(field) {
        return form.querySelector('[data-feedback-for="' + field + '"]');
    }

    function setFieldState(input, isValid, message) {
        if (!input) {
            return;
        }

        var feedback = getFeedback(input.id);

        input.classList.remove('border-red-500', 'bg-red-50', 'focus:border-red-500', 'focus:ring-red-100');
        input.classList.remove('border-slateblue', 'bg-white', 'focus:border-slateblue', 'focus:ring-blue-100');

        if (isValid) {
            if (feedback) {
                feedback.classList.add('hidden');
                feedback.textContent = '';
            }
            input.classList.add('border-slateblue', 'bg-white', 'focus:border-slateblue', 'focus:ring-blue-100');
            return;
        }

        input.classList.add('border-red-500', 'bg-red-50', 'focus:border-red-500', 'focus:ring-red-100');
        if (feedback) {
            feedback.textContent = message || feedback.textContent;
            feedback.classList.remove('hidden');
        }
    }

    function resetFieldState(input) {
        if (!input) {
            return;
        }

        var feedback = getFeedback(input.id);
        input.classList.remove('border-red-500', 'bg-red-50', 'focus:border-red-500', 'focus:ring-red-100');
        if (feedback) {
            feedback.classList.add('hidden');
        }
    }

    function showStatus(type, message) {
        if (!statusBox) {
            return;
        }

        statusBox.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-emerald-100', 'text-emerald-700', 'bg-amber-100', 'text-amber-700');

        if (type === 'success') {
            statusBox.classList.add('bg-emerald-100', 'text-emerald-700');
        } else if (type === 'warning') {
            statusBox.classList.add('bg-amber-100', 'text-amber-700');
        } else {
            statusBox.classList.add('bg-red-100', 'text-red-700');
        }

        statusBox.textContent = message;
    }

    function clearStatus() {
        if (!statusBox) {
            return;
        }

        statusBox.classList.add('hidden');
        statusBox.textContent = '';
    }

    function validateField(input) {
        if (!input) {
            return true;
        }

        if (input.validity.valid) {
            setFieldState(input, true);
            return true;
        }

        var message = 'Por favor revisa este campo.';
        if (input.id === 'nombre') {
            message = 'Por favor ingresa tu nombre completo.';
        } else if (input.id === 'email') {
            message = 'Por favor ingresa un correo electronico valido.';
        } else if (input.id === 'asunto') {
            message = 'Por favor selecciona un asunto.';
        } else if (input.id === 'mensaje') {
            message = 'Por favor escribe tu mensaje.';
        }

        setFieldState(input, false, message);
        return false;
    }

    ['nombre', 'email', 'telefono', 'asunto', 'mensaje'].forEach(function (fieldId) {
        var input = document.getElementById(fieldId);
        if (!input) {
            return;
        }

        input.addEventListener('input', function () {
            clearStatus();
            if (input.id === 'email' && input.validity.typeMismatch) {
                setFieldState(input, false, 'Por favor ingresa un correo electronico valido.');
                return;
            }

            if (input.value.trim() !== '' || input.id === 'telefono') {
                validateField(input);
            } else {
                resetFieldState(input);
            }
        });

        input.addEventListener('change', function () {
            clearStatus();
            validateField(input);
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearStatus();

        var fields = [
            document.getElementById('nombre'),
            document.getElementById('email'),
            document.getElementById('asunto'),
            document.getElementById('mensaje')
        ];

        var isValid = fields.every(validateField);

        if (!isValid) {
            showStatus('warning', 'Revisa los campos marcados antes de enviar el formulario.');
            return;
        }

        var recaptchaResponse = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
        if (!recaptchaResponse) {
            showStatus('warning', 'Completa la verificacion de seguridad antes de enviar el formulario.');
            return;
        }

        var formData = new FormData(form);
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
        }

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.success) {
                    form.reset();
                    ['nombre', 'email', 'telefono', 'asunto', 'mensaje'].forEach(function (fieldId) {
                        resetFieldState(document.getElementById(fieldId));
                    });
                    if (typeof grecaptcha !== 'undefined') {
                        grecaptcha.reset();
                    }
                    showStatus('success', data.message || 'Tu mensaje fue enviado correctamente.');
                    return;
                }

                if (data.errors) {
                    Object.keys(data.errors).forEach(function (field) {
                        var input = document.getElementById(field);
                        setFieldState(input, false, data.errors[field]);
                    });
                    showStatus('warning', 'Revisa los campos marcados antes de volver a enviar.');
                    return;
                }

                showStatus('error', data.message || 'No se pudo enviar el formulario.');
            })
            .catch(function () {
                showStatus('error', 'Ocurrio un error al enviar el formulario. Intenta nuevamente.');
            })
            .finally(function () {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar mensaje';
                }
            });
    });
});
