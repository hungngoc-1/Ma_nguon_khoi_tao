"use strict";

// Dữ liệu khởi tạo.
let items = [
  {
    "id": 1,
    "title": "Viết báo cáo HTML",
    "dueDate": "2026-10-20",
    "priority": "Cao",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "Ôn Flexbox",
    "dueDate": "2026-10-23",
    "priority": "Trung bình",
    "status": "pending"
  },
  {
    "id": 3,
    "title": "Làm bài DOM",
    "dueDate": "2026-10-19",
    "priority": "Cao",
    "status": "done"
  },
  {
    "id": 4,
    "title": "Đọc tài liệu CSS",
    "dueDate": "2026-10-25",
    "priority": "Thấp",
    "status": "pending"
  },
  {
    "id": 5,
    "title": "Thiết kế trang cá nhân",
    "dueDate": "2026-10-21",
    "priority": "Trung bình",
    "status": "done"
  }
];

// Lấy các phần tử DOM cần thiết (dựa theo id của file HTML)
const taskForm = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-name'); 
const dueDateInput = document.querySelector('#task-deadline');
const priorityInput = document.querySelector('#task-priority');
const errorMsg = document.querySelector('#error-msg');
const taskList = document.querySelector('#task-list');
const searchInput = document.querySelector('#search-input');
const filterStatus = document.querySelector('#filter-status');

// C1 & C3: Viết hàm hiển thị dữ liệu từ mảng lên DOM (kết hợp Tìm kiếm & Lọc)
function renderItems() {
  // Lấy giá trị tìm kiếm và lọc
  const keyword = searchInput.value.toLowerCase().trim();
  const rawFilter = filterStatus.value; 
  
  // Ánh xạ value của thẻ <select> HTML sang status của mảng ("pending" / "done")
  let filterVal = "all";
  if (rawFilter === "Chưa hoàn thành") filterVal = "pending";
  if (rawFilter === "Đã hoàn thành") filterVal = "done";
  if (rawFilter === "Tất cả") filterVal = "all";

  // Lọc mảng items dựa trên keyword (không phân biệt hoa thường) và trạng thái
  const filteredItems = items.filter(item => {
    const matchTitle = item.title.toLowerCase().includes(keyword);
    const matchStatus = (filterVal === "all") || (item.status === filterVal);
    return matchTitle && matchStatus;
  });

  // Xóa nội dung danh sách cũ
  taskList.innerHTML = '';

  if (filteredItems.length === 0) {
    taskList.innerHTML = '<li class="empty-msg">Không tìm thấy công việc nào phù hợp.</li>';
    return;
  }

  // Tạo các thẻ <li> và gắn lên DOM
  filteredItems.forEach(item => {
    const li = document.createElement('li');
    li.className = `task-item ${item.status === 'done' ? 'completed' : ''}`;
    
    // Đặt màu class cho Mức ưu tiên
    let priorityClass = '';
    if (item.priority === 'Cao') priorityClass = 'priority-high';
    else if (item.priority === 'Trung bình') priorityClass = 'priority-medium';
    else priorityClass = 'priority-low';

    // Đổi chữ hiển thị theo trạng thái
    const statusText = item.status === 'done' ? 'Đã hoàn thành' : 'Chưa hoàn thành';
    const btnActionText = item.status === 'done' ? 'Hoàn tác' : 'Hoàn thành';

    li.innerHTML = `
      <div class="task-info">
        <h3 class="task-title">${item.title}</h3>
        <div class="task-meta">
          <span class="badge ${priorityClass}">${item.priority}</span>
          <span>📅 ${item.dueDate || 'Không có hạn'}</span>
          <span class="status-text">${statusText}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-toggle" onclick="toggleStatus(${item.id})">${btnActionText}</button>
        <button class="btn btn-delete" onclick="deleteItem(${item.id})">Xóa</button>
      </div>
    `;
    
    taskList.appendChild(li);
  });
}

// C2: Viết hàm đọc form, kiểm tra dữ liệu và thêm bản ghi
taskForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Ngăn chặn load lại trang
  
  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  // Kiểm tra tên công việc không được để trống
  if (!title) {
    errorMsg.textContent = "Vui lòng nhập tên công việc!";
    titleInput.focus();
    return;
  }

  errorMsg.textContent = ""; // Xóa thông báo lỗi (nếu có)

  // Tạo đối tượng công việc mới
  const newItem = {
    id: Date.now(), // Tạo ID ngẫu nhiên không trùng lặp dựa trên timestamp
    title: title,
    dueDate: dueDate,
    priority: priority,
    status: "pending" // Trạng thái mặc định
  };

  // Cập nhật mảng và render lại
  items.unshift(newItem); // Đẩy công việc mới lên đầu danh sách
  renderItems();

  // Reset xóa nội dung trong form
  taskForm.reset();
});

// C3: Gọi lại hàm render mỗi khi người dùng Gõ tìm kiếm hoặc Đổi bộ lọc
searchInput.addEventListener('input', renderItems);
filterStatus.addEventListener('change', renderItems);

// C4: Viết chức năng cập nhật trạng thái theo ID
window.toggleStatus = function(id) {
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    // Đảo ngược trạng thái
    items[index].status = items[index].status === "pending" ? "done" : "pending";
    renderItems(); // Cập nhật lại giao diện
  }
};

// C4: Viết chức năng xóa theo ID
window.deleteItem = function(id) {
  if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
    // Lọc bỏ item có id trùng với id cần xóa
    items = items.filter(item => item.id !== id);
    renderItems(); // Cập nhật lại giao diện
  }
};

// Khởi chạy hàm render lần đầu để hiển thị 5 dữ liệu mẫu
renderItems();