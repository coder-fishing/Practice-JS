let totalNotifications = 0;
const subMenu = (subMenuName, notification) => {
  if (notification > 0) {
    totalNotifications += notification;
    return `
      <div class="subMenu">
        <p class="subMenu__name">${subMenuName}</p>
        <span class="subMenu__notification" notification="${notification}">
          <span class="subMenu__notification--number">${notification}</span>
        </span>
      </div>
    `;
  }

  return `
    <div class="subMenu">
      <p class="subMenu__name">${subMenuName}</p>
    </div>
  `;
};
const getTotalNotifications = () => totalNotifications;

export { subMenu, getTotalNotifications };