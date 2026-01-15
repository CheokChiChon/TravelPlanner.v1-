// Applying lucide Icon
lucide.createIcons();

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// place choose
const filterButtons = document.querySelectorAll('.destination-filter');
const destinationCards = document.querySelectorAll('.destination-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // delete the active type
        filterButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });

        // adding to active type
        button.classList.add('active', 'bg-blue-600', 'text-white');
        button.classList.remove('bg-gray-200', 'text-gray-700');

        const filter = button.getAttribute('data-filter');

    
        destinationCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Plan saved array
let itineraries = []; 
let currentItinerary = null; 

let currentCity = '';
let currentAttractions = [];

// add the recommend place to user travel plan after using kick it
const addToItineraryButtons = document.querySelectorAll('.add-to-itinerary');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');

addToItineraryButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentCity = button.getAttribute('data-city');
        currentAttractions = JSON.parse(button.getAttribute('data-attractions'));

        modalTitle.textContent = `添加${currentCity}景點到行程`;

        let attractionsHTML = `
            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">選擇景點</label>
                <div class="space-y-2">
        `;

        currentAttractions.forEach(attraction => {
            attractionsHTML += `
                <div class="flex items-center">
                    <input type="checkbox" id="attraction-${attraction}" name="attractions" value="${attraction}" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" checked>
                    <label for="attraction-${attraction}" class="ml-2 text-gray-700">${attraction}</label>
                </div>
            `;
        });

        attractionsHTML += `
                </div>
            </div>
            <div class="mb-4">
                <label for="trip-day" class="block text-gray-700 font-medium mb-2">選擇日期</label>
                <select id="trip-day" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        `;

        // There should input the startDate and endDate of the travel
        if (!currentItinerary.startDate || !currentItinerary.endDate) {
            attractionsHTML += `
                <option value="" disabled selected>請先設置行程日期</option>
            `;
        } else {
            // 生成日期選項
            const start = new Date(currentItinerary.startDate);
            const end = new Date(currentItinerary.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            for (let i = 0; i <= diffDays; i++) {
                const date = new Date(start);
                date.setDate(start.getDate() + i);
                const dayOption = date.toISOString().split('T')[0];
                attractionsHTML += `
                    <option value="${dayOption}">第${i + 1}天 (${dayOption})</option>
                `;
            }
        }

        attractionsHTML += `
                </select>
            </div>
            <div>
                <label for="activity-time" class="block text-gray-700 font-medium mb-2">活動時間</label>
                <input type="time" id="activity-time" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
        `;

        modalContent.innerHTML = attractionsHTML;
        modal.classList.remove('hidden');
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modalCancel.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});


// add the event or adjust the event
modalConfirm.addEventListener('click', () => {
    const selectedAttractions = [];
    const attractionCheckboxes = document.querySelectorAll('input[name="attractions"]:checked');

    attractionCheckboxes.forEach(checkbox => {
        selectedAttractions.push(checkbox.value);
    });

    const selectedDay = document.getElementById('trip-day').value;
    const activityTime = document.getElementById('activity-time').value || '09:00';

    if (!selectedDay) {
        alert('請先設置行程日期');
        return;
    }

    if (selectedAttractions.length === 0) {
        alert('請至少選擇一個景點');
        return;
    }

    let dayIndex = currentItinerary.days.findIndex(day => day.date === selectedDay);

    if (dayIndex === -1) {
        currentItinerary.days.push({
            date: selectedDay,
            activities: []
        });
        dayIndex = currentItinerary.days.length - 1;
    }


    selectedAttractions.forEach(attraction => {
        currentItinerary.days[dayIndex].activities.push({
            time: activityTime,
            activity: attraction,
            location: currentCity,
            notes: ''
        });
    });

    // shown that the itinerary is successfully made or adjusted
    updateItineraryDisplay();

    modal.classList.add('hidden');
});

// save button
const saveItineraryButton = document.getElementById('save-itinerary');

saveItineraryButton.addEventListener('click', () => {
    const itineraryName = document.getElementById('itinerary-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const notes = document.getElementById('itinerary-notes').value;

    if (!itineraryName) {
        alert('請輸入行程名稱');
        return;
    }

    if (!startDate || !endDate) {
        alert('請設置旅行日期');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        alert('開始日期不能晚於結束日期');
        return;
    }

    // update the itinerary 
    currentItinerary.name = itineraryName;
    currentItinerary.startDate = startDate;
    currentItinerary.endDate = endDate;
    currentItinerary.notes = notes;

    const existingIndex = itineraries.findIndex(i => i.name === itineraryName);
    
    
    if (existingIndex!== -1){
        itineraries[existingIndex] = JSON.parse(JSON.stringify(currentItinerary));

    } else {
        
        itineraries.push(JSON.parse(JSON.stringify(currentItinerary)));
    }

    
    updateItineraryDisplay();

    //save the itineraries
    saveItineraries();
    
  
    updateSavedItinerariesList();

    alert('行程已保存');
});

// create a new itinerary
const newItineraryButton = document.getElementById('new-itinerary');

newItineraryButton.addEventListener('click', () => {
    createNewItinerary();
});

// function to display an itinerary 
function updateItineraryDisplay() {
    const daysContainer = document.getElementById('days-container');

    if (!currentItinerary.startDate || !currentItinerary.endDate) {
        daysContainer.innerHTML = `
            <div class="text-center text-gray-500 py-12">
                <i data-lucide="calendar" class="w-16 h-16 mx-auto mb-4 text-gray-300"></i>
                <p class="text-lg">您還沒有添加任何行程安排</p>
                <p class="mt-2">從目的地推薦中選擇景點添加到行程，或點擊"創建新行程"開始規劃</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    const start = new Date(currentItinerary.startDate);
    const end = new Date(currentItinerary.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let daysHTML = '';

    for (let i = 0; i <= diffDays; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        const dayDate = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('zh-TW', { weekday: 'long' });

        // searching the activities
        const dayActivities = currentItinerary.days.find(day => day.date === dayDate);

        daysHTML += `
            <div class="itinerary-day border border-gray-200 rounded-lg mb-6 overflow-hidden">
                <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
                    <h5 class="text-lg font-bold text-gray-800">第${i + 1}天 - ${dayDate} (${dayName})</h5>
                </div>
                <div class="p-6">
        `;
        // sorting the activities by time
        if (dayActivities && dayActivities.activities.length > 0) {
            
            dayActivities.activities.sort((a, b) => a.time.localeCompare(b.time));

            daysHTML += `
                <div class="space-y-4">
            `;

            dayActivities.activities.forEach((activity, index) => {
                daysHTML += `
                    <div class="flex items-start">
                        <div class="w-16 text-gray-500 font-medium flex-shrink-0">${activity.time}</div>
                        <div class="flex-1">
                            <div class="flex items-center">
                                <i data-lucide="map-pin" class="w-4 h-4 mr-2 text-red-500"></i>
                                <h6 class="font-semibold text-gray-800">${activity.activity}</h6>
                                <span class="ml-2 text-sm text-gray-500">${activity.location}</span>
                            </div>
                            ${activity.notes ? `<p class="text-gray-600 mt-1">${activity.notes}</p>` : ''}
                            <div class="mt-2 flex space-x-2">
                                <button class="edit-activity text-blue-600 hover:text-blue-800 text-sm" data-day="${dayDate}" data-index="${index}">
                                    <i data-lucide="edit" class="w-4 h-4 inline mr-1"></i>編輯
                                </button>
                                <button class="delete-activity text-red-600 hover:text-red-800 text-sm" data-day="${dayDate}" data-index="${index}">
                                    <i data-lucide="trash-2" class="w-4 h-4 inline mr-1"></i>刪除
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });

            daysHTML += `
                </div>
            `;
        } 


        daysHTML += `
            <div class="mt-6 text-center">
                <button class="add-activity bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" data-day="${dayDate}">
                    <i data-lucide="plus" class="w-4 h-4 inline mr-1"></i>添加活動
                </button>
            </div>
        `;

        daysHTML += `
                </div>
            </div>
        `;
    }

    daysContainer.innerHTML = daysHTML;

    document.querySelectorAll('.edit-activity').forEach(button => {
        button.addEventListener('click', () => {
            const day = button.getAttribute('data-day');
            const index = button.getAttribute('data-index');
            editActivity(day, index);
        });
    });

    document.querySelectorAll('.delete-activity').forEach(button => {
        button.addEventListener('click', () => {
            const day = button.getAttribute('data-day');
            const index = button.getAttribute('data-index');
            deleteActivity(day, index);
        });
    });

    document.querySelectorAll('.add-activity').forEach(button => {
        button.addEventListener('click', () => {
            const day = button.getAttribute('data-day');
            addActivity(day);
        });
    });

    lucide.createIcons();
}

// edit the activity 
function editActivity(day, index) {
    const dayIndex = currentItinerary.days.findIndex(d => d.date === day);

    if (dayIndex === -1) return;

    const activity = currentItinerary.days[dayIndex].activities[index];

    modalTitle.textContent = '編輯活動';
    modalContent.innerHTML = `
        <div class="mb-4">
            <label for="edit-activity-name" class="block text-gray-700 font-medium mb-2">活動名稱</label>
            <input type="text" id="edit-activity-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="${activity.activity}">
        </div>
        <div class="mb-4">
            <label for="edit-activity-time" class="block text-gray-700 font-medium mb-2">活動時間</label>
            <input type="time" id="edit-activity-time" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="${activity.time}">
        </div>
        <div class="mb-4">
            <label for="edit-activity-location" class="block text-gray-700 font-medium mb-2">活動地點</label>
            <input type="text" id="edit-activity-location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="${activity.location}">
        </div>
        <div>
            <label for="edit-activity-notes" class="block text-gray-700 font-medium mb-2">活動備註</label>
            <textarea id="edit-activity-notes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">${activity.notes || ''}</textarea>
        </div>
    `;

    modalConfirm.onclick = () => {
        const activityName = document.getElementById('edit-activity-name').value;
        const activityTime = document.getElementById('edit-activity-time').value;
        const activityLocation = document.getElementById('edit-activity-location').value;
        const activityNotes = document.getElementById('edit-activity-notes').value;

        if (!activityName) {
            alert('請輸入活動名稱');
            return;
        }

        if (!activityTime) {
            alert('請設置活動時間');
            return;
        }

        if (!activityLocation) {
            alert('請輸入活動地點');
            return;
        }

        currentItinerary.days[dayIndex].activities[index] = {
            time: activityTime,
            activity: activityName,
            location: activityLocation,
            notes: activityNotes
        };

        updateItineraryDisplay();

        modal.classList.add('hidden');
    };

    modal.classList.remove('hidden');
}

// delete the activity
function deleteActivity(day, index) {
    const dayIndex = currentItinerary.days.findIndex(d => d.date === day);

    if (dayIndex === -1) return;

    if (confirm('確定要刪除這個活動嗎？')) {
        currentItinerary.days[dayIndex].activities.splice(index, 1);

        if (currentItinerary.days[dayIndex].activities.length === 0) {
            currentItinerary.days.splice(dayIndex, 1);
        }

        
        updateItineraryDisplay();
    }
}

// add a activity
function addActivity(day) {
    modalTitle.textContent = '添加活動';
    modalContent.innerHTML = `
        <div class="mb-4">
            <label for="add-activity-name" class="block text-gray-700 font-medium mb-2">活動名稱</label>
            <input type="text" id="add-activity-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="輸入活動名稱">
        </div>
        <div class="mb-4">
            <label for="add-activity-time" class="block text-gray-700 font-medium mb-2">活動時間</label>
            <input type="time" id="add-activity-time" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value="09:00">
        </div>
        <div class="mb-4">
            <label for="add-activity-location" class="block text-gray-700 font-medium mb-2">活動地點</label>
            <input type="text" id="add-activity-location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="輸入活動地點">
        </div>
        <div>
            <label for="add-activity-notes" class="block text-gray-700 font-medium mb-2">活動備註</label>
            <textarea id="add-activity-notes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="添加備註..."></textarea>
        </div>
    `;

    modalConfirm.onclick = () => {
        const activityName = document.getElementById('add-activity-name').value;
        const activityTime = document.getElementById('add-activity-time').value;
        const activityLocation = document.getElementById('add-activity-location').value;
        const activityNotes = document.getElementById('add-activity-notes').value;

        if (!activityName) {
            alert('請輸入活動名稱');
            return;
        }

        if (!activityTime) {
            alert('請設置活動時間');
            return;
        }

        if (!activityLocation) {
            alert('請輸入活動地點');
            return;
        }

        let dayIndex = currentItinerary.days.findIndex(d => d.date === day);

        if (dayIndex === -1) {
            currentItinerary.days.push({
                date: day,
                activities: []
            });
            dayIndex = currentItinerary.days.length - 1;
        }

        currentItinerary.days[dayIndex].activities.push({
            time: activityTime,
            activity: activityName,
            location: activityLocation,
            notes: activityNotes
        });

        updateItineraryDisplay();

        modal.classList.add('hidden');
    };

    modal.classList.remove('hidden');
}

// Save all the itineraries 
function saveItineraries() {
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
}

// Load the itineraries 
function loadItineraries() {
    const savedItineraries = localStorage.getItem('itineraries');
    
    if (savedItineraries) {
        itineraries = JSON.parse(savedItineraries);
        
        if (itineraries.length > 0) {
            loadItineraryByName(itineraries[0].name);
        } else {
            createNewItinerary();
        }
    } else {
        createNewItinerary();
    }
    
    updateSavedItinerariesList();
}


function loadItineraryByName(name) {
    const foundItinerary = itineraries.find(i => i.name === name);
    
    if (foundItinerary) {
        currentItinerary = JSON.parse(JSON.stringify(foundItinerary)); // 深拷贝
        
        document.getElementById('itinerary-name').value = currentItinerary.name;
        document.getElementById('start-date').value = currentItinerary.startDate;
        document.getElementById('end-date').value = currentItinerary.endDate;
        document.getElementById('itinerary-notes').value = currentItinerary.notes;
        
        
        updateItineraryDisplay();
    }
}


function createNewItinerary() {
    currentItinerary = {
        name: '',
        startDate: '',
        endDate: '',
        notes: '',
        days: []
    };
    
    // clear the itinerary list
    document.getElementById('itinerary-name').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    document.getElementById('itinerary-notes').value = '';
    

    updateItineraryDisplay();
}

// Update the saved itinerarieslist
function updateSavedItinerariesList() {
    const savedItinerariesContainer = document.getElementById('saved-itineraries');
    const savedItinerariesGrid = savedItinerariesContainer.querySelector('.grid');
    
    if (itineraries.length === 0) {
        savedItinerariesContainer.classList.add('hidden');
        return;
    }
    
    savedItinerariesContainer.classList.remove('hidden');
    
    let itinerariesHTML = '';
    itineraries.forEach(itinerary => {
        const startDate = new Date(itinerary.startDate).toLocaleDateString('zh-TW');
        const endDate = new Date(itinerary.endDate).toLocaleDateString('zh-TW');
        const daysCount = itinerary.days.length;
        
        itinerariesHTML += `
            <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${itinerary.name}</h3>
                    <div class="flex items-center text-gray-600 mb-2">
                        <i data-lucide="calendar" class="w-4 h-4 mr-2"></i>
                        <span>${startDate} - ${endDate}</span>
                    </div>
                    <div class="flex items-center text-gray-600 mb-4">
                        <i data-lucide="map-pin" class="w-4 h-4 mr-2"></i>
                        <span>${daysCount} 天行程</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="load-itinerary bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" data-name="${itinerary.name}">
                            查看行程
                        </button>
                        <button class="delete-itinerary bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors" data-name="${itinerary.name}">
                            <i data-lucide="trash-2" class="w-4 h-4 inline mr-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    savedItinerariesGrid.innerHTML = itinerariesHTML;
    
    document.querySelectorAll('.load-itinerary').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            loadItineraryByName(name);
        });
    });
    
    document.querySelectorAll('.delete-itinerary').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            if (confirm(`確定要刪除行程「${name}」嗎？`)) {
                itineraries = itineraries.filter(i => i.name !== name);
                saveItineraries();
                updateSavedItinerariesList();
                

                if (currentItinerary && currentItinerary.name === name) {
                    if (itineraries.length > 0) {
                        loadItineraryByName(itineraries[0].name);
                    } else {
                        createNewItinerary();
                    }
                }
            }
        });
    });
    
    lucide.createIcons();
}

// a chating function
const chatInput = document.getElementById('chat-input');
const sendMessageButton = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');
const quickQuestions = document.querySelectorAll('.quick-question');

// send a message
function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) return;

    addMessage(message, 'user');

    chatInput.value = '';

    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();

        // get the response from chatbot
        const response = getAIResponse(message);
        addMessage(response, 'ai');
    }, 1000);
}

// adding message to the chatroom
function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message flex mb-4';

    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="flex-1"></div>
            <div class="bg-blue-600 p-3 rounded-lg shadow max-w-[80%]">
                <p class="text-white">${message}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 flex-shrink-0">
                <i data-lucide="user" class="w-4 h-4 text-gray-600"></i>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <img src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/940db655332948d49b35eeb4079a42db~tplv-a9rns2rl98-image.image?rcl=202512192113146ED7B022D8A76A9A583A&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768742006&x-signature=Sh2Hqff0LkAOGfS%2Bw%2F0j4XtQb0I%3D" 
                 alt="AI旅行助手" 
                 class="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0" />
            <div class="bg-white p-3 rounded-lg shadow max-w-[80%]">
                <p>${message}</p>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    lucide.createIcons();
}

// to showing typying
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat-message flex mb-4';
    typingDiv.innerHTML = `
        <img src="https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/940db655332948d49b35eeb4079a42db~tplv-a9rns2rl98-image.image?rcl=202512192113146ED7B022D8A76A9A583A&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768742006&x-signature=Sh2Hqff0LkAOGfS%2Bw%2F0j4XtQb0I%3D" 
             alt="AI旅行助手" 
             class="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0" />
        <div class="bg-white p-3 rounded-lg shadow">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    lucide.createIcons();
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');

    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// the returned message from chatbot
function getAIResponse(message) {
    
    const normalizedMessage = message.toLowerCase().replace(/[.,?!]/g, '');

    if (normalizedMessage.includes('東京') && (normalizedMessage.includes('季節') || normalizedMessage.includes('時間') || normalizedMessage.includes('時候'))) {
        return '東京最佳旅遊季節是春季（3-5月）和秋季（9-11月）。春季可以欣賞櫻花，秋季則有美麗的紅葉，而且天氣宜人，非常適合觀光。';
    }

    if (normalizedMessage.includes('巴黎') && (normalizedMessage.includes('必去') || normalizedMessage.includes('景點') || normalizedMessage.includes('地方'))) {
        return '巴黎必去景點包括：艾菲爾鐵塔、羅浮宮、巴黎聖母院、凱旋門、香榭麗舍大街、蒙馬特高地和塞納河遊船。建議至少安排3-4天時間遊覽這些主要景點。';
    }

    if (normalizedMessage.includes('歐洲') && (normalizedMessage.includes('多國') || normalizedMessage.includes('規劃'))) {
        return '規劃歐洲多國遊時，建議根據地理位置合理安排路線，避免不必要的往返。例如：\n1. 西歐線：法國、義大利、西班牙、葡萄牙\n2. 中歐線：德國、奧地利、瑞士、捷克\n3. 北歐線：丹麥、瑞典、挪威、芬蘭\n\n建議每個國家停留7-10天，這樣可以有足夠時間體驗當地文化。提前預訂交通和住宿可以節省費用。';
    }

    if (normalizedMessage.includes('簽證') || normalizedMessage.includes('護照')) {
        return '辦理簽證需要準備：有效護照（通常有效期需超過回國日期6個月）、簽證申請表、照片、往返機票預訂、酒店預訂、旅行保險、銀行流水等財務證明。不同國家的簽證要求可能有所不同，建議提前2-3個月開始準備，並查詢目的地國家使館的最新要求。';
    }

    if (normalizedMessage.includes('行李') || normalizedMessage.includes('打包')) {
        return '打包行李的建議：\n1. 根據目的地天氣和行程準備衣物，建議選擇易搭配的單品\n2. 必備物品：護照、簽證、現金、信用卡、手機充電器、轉換插頭、常用藥物\n3. 盡量使用打包袋分類整理衣物，節省空間\n4. 貴重物品隨身攜帶，不要放在托運行李中\n5. 液體物品注意航空公司規定，一般不超過100ml且需裝在透明密封袋中';
    }

    if (normalizedMessage.includes('安全') || normalizedMessage.includes('注意')) {
        return '旅行安全注意事項：\n1. 提前了解目的地的安全狀況和風俗習慣\n2. 保管好個人財物，特別是在人多的地方\n3. 備份重要證件的電子版本\n4. 購買旅行保險\n5. 記下當地中國使館的聯繫方式\n6. 尊重當地文化和法律\n7. 避免前往危險區域\n8. 保持通訊工具暢通';
    }

    if (normalizedMessage.includes('預算') || normalizedMessage.includes('花費')) {
        return '旅行預算規劃建議：\n1. 交通：機票、當地交通（地鐵、公交、租車等）\n2. 住宿：酒店、民宿或公寓\n3. 餐飲：餐廳、小吃、超市購物\n4. 景點門票：提前在線購買可能有折扣\n5. 購物：紀念品、當地特色商品\n6. 其他：旅行保險、小費、應急資金\n\n一般來說，發達國家如美國、歐洲、日本的花費較高，東南亞、南亞等地區相對經濟實惠。建議預留總預算的10-20%作為應急資金。';
    }

    if (normalizedMessage.includes('你好') || normalizedMessage.includes('嗨') || normalizedMessage.includes('您好')) {
        return '您好！我是您的AI旅行助手。有什麼可以幫您規劃旅行的問題嗎？';
    }

    // Other reply
    return '感謝您的提問！作為AI旅行助手，我可以幫您解答關於目的地信息、行程規劃、簽證要求、旅行準備等問題。請問您有什麼具體的旅行計劃或疑問嗎？';
}

sendMessageButton.addEventListener('click', sendMessage);


chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});


quickQuestions.forEach(button => {
    button.addEventListener('click', () => {
        chatInput.value = button.textContent;
        sendMessage();
    });
});

// The 3D earth 
function initEarth() {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, document.getElementById('earth-container').offsetWidth / document.getElementById('earth-container').offsetHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(document.getElementById('earth-container').offsetWidth, document.getElementById('earth-container').offsetHeight);
    document.getElementById('earth-container').appendChild(renderer.domElement);

    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg');

    const earthMaterial = new THREE.MeshBasicMaterial({
        map: earthTexture
    });

    // the setting of the earth
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;


    function animate() {
        requestAnimationFrame(animate);

        // Self rotated of the earth
        earth.rotation.y += 0.001;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    
    window.addEventListener('resize', () => {
        camera.aspect = document.getElementById('earth-container').offsetWidth / document.getElementById('earth-container').offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(document.getElementById('earth-container').offsetWidth, document.getElementById('earth-container').offsetHeight);
    });
}

// initialize the page
window.addEventListener('load', () => {
    loadItineraries();
    initEarth();
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.destination-card').forEach((card, i) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            delay: i * 0.1
        });
    });

    //Animation of the title
    gsap.utils.toArray('h2').forEach(title => {
        gsap.from(title, {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
});