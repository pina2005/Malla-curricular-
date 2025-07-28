document.addEventListener('DOMContentLoaded', () => {
    // Definición de los semestres y sus ramos, incluyendo los prerrequisitos
    const semesters = [
        {
            id: 's1',
            name: 'Semestre 1',
            courses: [
                { id: 'hbiologia', name: 'Histobiología' },
                { id: 'eyf', name: 'Estructura y Función' },
                { id: 'ipob', name: 'Introducción a la Profesión Obstetricia' },
                { id: 'psa', name: 'Psic. Social y Antropología' },
                { id: 'gpersonal', name: 'Gestión Personal' },
                { id: 'plmat', name: 'Pensamiento Lógico Matemático' },
            ]
        },
        {
            id: 's2',
            name: 'Semestre 2',
            courses: [
                { id: 'myp', name: 'Microbiología y Parasitología', prerequisites: ['hbiologia'] },
                { id: 'scorporales', name: 'Sistema Corporales', prerequisites: ['eyf'] },
                { id: 'gysp', name: 'Gestión y Salud Pública', prerequisites: ['ipob'] },
                { id: 'qgybq', name: 'Química General y Bioquímica' },
                { id: 'eoyescrita', name: 'Expresión Oral y Escrita', prerequisites: ['psa'] },
                { id: 'hmybptc', name: 'Herramientas y Métodos básicos para el trabajo científico', prerequisites: ['plmat'] },
            ]
        },
        {
            id: 's3',
            name: 'Semestre 3',
            courses: [
                { id: 'pparf', name: 'Procesos Patológicos y Farmacológicos', prerequisites: ['scorporales', 'myp', 'qgybq'] },
                { id: 'embriologia', name: 'Embriología', prerequisites: ['scorporales'] },
                { id: 'penfmat1', name: 'Proc. De Enfermería P/matr I', prerequisites: ['gysp'] },
                { id: 'apelifetal', name: 'Anatomía Pélvica y Fetal', prerequisites: ['scorporales'] },
                { id: 'epidbioestad', name: 'Epidemiología y Bioestadística', prerequisites: ['hmybptc'] },
                { id: 'ingles1', name: 'Inglés I', prerequisites: ['eoyescrita'] },
            ]
        },
        {
            id: 's4',
            name: 'Semestre 4',
            courses: [
                { id: 'ginecologia1', name: 'Ginecología I', prerequisites: ['pparf'] },
                { id: 'obstfisiologica', name: 'Obstetricia Fisiológica', prerequisites: ['apelifetal', 'embriologia'] },
                { id: 'penfmat2', name: 'Proc. De Enfermería P/matr II', prerequisites: ['penfmat1'] },
                { id: 'itcomunitario', name: 'Introducción al Trabajo Comunitario', prerequisites: ['epidbioestad'] },
                { id: 'ingles2', name: 'Inglés II', prerequisites: ['ingles1'] },
                { id: 'fgeneral', name: 'Formación General' },
            ]
        },
    ];

    // Mensajes motivacionales
    const motivationalMessages = [
        "¡Tu puedes potito!",
        "¡Eres la mejor matrona!",
        "¡Vamos con todo!",
        "Cada ramo aprobado es un paso más cerca de tu meta.",
        "¡Te amo mi poto loco!",
        "¡Sigue adelante, campeona!",
        "Tu esfuerzo valdrá la pena.",
        "¡No te rindas, estás haciéndolo increíble!",
    ];

    // Referencias a elementos del DOM
    const curriculumGrid = document.querySelector('.curriculum-grid');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalMotivationalMessage = document.getElementById('modal-motivational-message');
    const closeButton = document.querySelector('.close-button');
    const headerMessage = document.getElementById('header-message');

    // Función para obtener los ramos aprobados desde el almacenamiento local
    const getApprovedCourses = () => {
        const approvedCourses = localStorage.getItem('approvedCourses');
        return approvedCourses ? new Set(JSON.parse(approvedCourses)) : new Set();
    };

    // Función para guardar los ramos aprobados en el almacenamiento local
    const saveApprovedCourses = (approvedCourses) => {
        localStorage.setItem('approvedCourses', JSON.stringify(Array.from(approvedCourses)));
    };

    let approvedCourses = getApprovedCourses(); // Carga los ramos aprobados al inicio

    // Función para seleccionar un mensaje motivacional aleatorio
    const getRandomMotivationalMessage = () => {
        const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
        return motivationalMessages[randomIndex];
    };

    // Muestra un mensaje motivacional al cargar la página
    headerMessage.textContent = getRandomMotivationalMessage();

    // Función para renderizar la malla curricular
    const renderCurriculum = () => {
        curriculumGrid.innerHTML = ''; // Limpiar el contenido actual
        semesters.forEach(semester => {
            const semesterDiv = document.createElement('div');
            semesterDiv.classList.add('semester');
            semesterDiv.innerHTML = `<h2>${semester.name}</h2><ul class="course-list"></ul>`;
            const courseList = semesterDiv.querySelector('.course-list');

            semester.courses.forEach(course => {
                const courseItem = document.createElement('li');
                courseItem.classList.add('course-item');
                courseItem.dataset.id = course.id;
                courseItem.textContent = course.name;

                // Verificar si el ramo está aprobado
                if (approvedCourses.has(course.id)) {
                    courseItem.classList.add('approved');
                } else {
                    // Verificar si el ramo está bloqueado (no cumple prerrequisitos)
                    const isBlocked = course.prerequisites && course.prerequisites.some(prereq => !approvedCourses.has(prereq));
                    if (isBlocked) {
                        courseItem.classList.add('blocked');
                    }
                }

                // Añadir el evento click al ramo
                courseItem.addEventListener('click', () => toggleCourseStatus(course));
                courseList.appendChild(courseItem);
            });
            curriculumGrid.appendChild(semesterDiv);
        });
    };

    // Función para cambiar el estado de un ramo (aprobado/no aprobado)
    const toggleCourseStatus = (course) => {
        const courseElement = document.querySelector(`.course-item[data-id="${course.id}"]`);

        if (approvedCourses.has(course.id)) {
            // Si ya está aprobado, no hacemos nada (o podrías añadir una opción para desaprobar)
            // Para esta implementación, los ramos aprobados no se pueden desaprobar haciendo clic.
            return;
        }

        // Verificar prerrequisitos
        if (course.prerequisites) {
            const missingPrerequisites = course.prerequisites.filter(prereq => !approvedCourses.has(prereq));
            if (missingPrerequisites.length > 0) {
                // Si faltan prerrequisitos, mostrar mensaje en el modal
                const missingNames = missingPrerequisites.map(prereqId => {
                    // Buscar el nombre del prerrequisito
                    for (const sem of semesters) {
                        const foundCourse = sem.courses.find(c => c.id === prereqId);
                        if (foundCourse) return foundCourse.name;
                    }
                    return prereqId; // En caso de no encontrar el nombre
                });
                showModal(`Para aprobar "${course.name}", primero debes aprobar: <br><br><strong>${missingNames.join(', ')}</strong>`, true);
                return;
            }
        }

        // Si todos los prerrequisitos están cumplidos, marcar como aprobado
        approvedCourses.add(course.id);
        saveApprovedCourses(approvedCourses); // Guardar en localStorage
        renderCurriculum(); // Volver a renderizar para actualizar el estado visual
        showModal(`¡Felicidades! Has aprobado "${course.name}"`, false);
    };

    // Función para mostrar el modal
    const showModal = (message, isError) => {
        modalMessage.innerHTML = message;
        modalMotivationalMessage.textContent = getRandomMotivationalMessage();
        modal.style.display = 'flex'; // Muestra el modal

        // Si es un error, puedes cambiar estilos del modal o del botón de cerrar si lo deseas
        if (isError) {
            modal.querySelector('.modal-content').style.border = '2px solid var(--primary-red)';
            modalMessage.style.color = 'var(--primary-red)';
        } else {
            modal.querySelector('.modal-content').style.border = '2px solid var(--approved-color)';
            modalMessage.style.color = 'var(--text-color)';
        }
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Event listener para cerrar el modal al hacer clic en la "x"
    closeButton.addEventListener('click', closeModal);

    // Event listener para cerrar el modal al hacer clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Renderizar la malla por primera vez al cargar la página
    renderCurriculum();
});
