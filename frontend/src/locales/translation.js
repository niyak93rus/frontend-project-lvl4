const resources = {
  translation: {
    addChannel: 'Добавить канал',
    backToMain: "Вернуться на главную",
    channels: "Каналы",
    channelAdded: 'Канал успешно добавлен!',
    channelRenamed: 'Канал переименован',
    channelRemoved: 'Канал удален',
    mainPage: "Главная",
    message: {
      placeholder: "Введите сообщение",
      button: "Отправить сообщение",
    },
    logIn: "Войти",
    loginLabel: "Логин",
    loginPlaceholder: "Введите логин",
    logOut: "Выйти",
    errors: {
      username: {
        length: "Логин должен быть от 3 до 20 символов",
        required: 'Логин обязателен!'
      },
      password: {
        length: "Пароль должен содержать от 6 до 20 символов",
        required: 'Пароль обязателен!'
      },
      passwordConfirmation: {
        oneOf: 'Не совпадает с введенным паролем',
        required: 'Введите подтверждение пароля!',
      },
      other: {
        authFailed: "Введен неверный логин или пароль",
        axiosError: 'Не удается связаться с сервером',
        existingChannel: 'Такой канал уже добавлен!',
        existingUsername: "Пользователь с таким именем уже существует!",
        messageNotDelivered: "Сообщение не доставлено",
        requiredChannelname: 'Укажите название канала!',
        unnknownError: 'Что-то пошло не так',
      },
    },
    pageNotFound: "404 - Страница не найдена!",
    passwordConfirmationLabel: 'Подтверждение пароля',
    passwordConfirmationPlaceholder: "Введите пароль еще раз",
    passwordLabel: "Пароль",
    passwordPlaceholder: 'Введите пароль',
    prompt: 'Вы уверены?',
    registration: "Регистрация",
    rename: "Переименовать",
    remove: "Удалить",
    signUp: "Зарегистрироваться",
  }
}

export default resources;