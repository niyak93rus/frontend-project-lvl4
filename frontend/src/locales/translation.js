const resources = {
  translation: {
    addChannel: 'Добавить канал',
    backToMain: "Вернуться на главную",
    channels: "Каналы",
    channelAdded: 'Канал создан',
    channelControl: 'Управление каналом',
    channelRenamed: 'Канал переименован',
    channelRemoved: 'Канал удалён',
    mainPage: "Главная",
    message: {
      placeholder: "Введите сообщение",
      button: "Отправить",
    },
    messageFormLabel: "Новое сообщение",
    modals: {
      cancel: "Отмена",
      channelName: "Имя канала",
      submit: "Отправить",
    },
    logIn: "Войти",
    loginPlaceholder: "Ваш ник",
    logOut: "Выйти",
    errors: {
      username: {
        length: "От 3 до 20 символов",
        required: 'Логин обязателен!'
      },
      password: {
        length: "Не менее 6 символов",
        required: 'Пароль обязателен!'
      },
      passwordConfirmation: {
        oneOf: 'Пароли должны совпадать',
        required: 'Введите подтверждение пароля!',
      },
      other: {
        authFailed: "Неверные имя пользователя или пароль",
        axiosError: 'Ошибка соединения',
        existingChannel: 'Должно быть уникальным',
        existingUsername: "Пользователь с таким именем уже существует!",
        messageNotDelivered: "Сообщение не доставлено",
        notRemovable: 'Канал нельзя удалить',
        requiredChannelname: 'Обязательное поле',
        unnknownError: 'Что-то пошло не так',
      },
    },
    pageNotFound: "404 - Страница не найдена!",
    passwordConfirmationLabel: 'Подтверждение пароля',
    passwordConfirmationPlaceholder: "Подтвердите пароль",
    passwordLabel: "Пароль",
    passwordPlaceholder: 'Пароль',
    prompt: 'Уверены?',
    promptSignUp: 'Нет аккаунта?',
    registration: "Регистрация",
    registrationUserName: "Имя пользователя",
    rename: "Переименовать",
    remove: "Удалить",
    signUp: "Зарегистрироваться",
  }
}

export default resources;