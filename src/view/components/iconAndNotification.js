const iconAndNotification = ( src , notification) => {
    return `
        <div class = "iconAndNotification">
            <img src=${src} alt="icon " class= " iconAndNotification-image" />
            ${notification && `
                <div class="iconAndNotification-notification">
                  <p class="iconAndNotification-notification-number">${notification}</p>
                </div>
              `}     
        </div>
    `
}

export default iconAndNotification;      