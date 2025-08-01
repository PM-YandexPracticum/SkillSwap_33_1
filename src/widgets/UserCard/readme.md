Компонент карточки пользователя

Пропсы
user - данные пользователя для карточки типа IUserCard
displayMode? - Режим отображения карточки типа UserCardDisplayType где default - отображения в списке, а profile вид карточки в профайле пользователя;
maxUserSkillsTagsShown? - максимальное число показанных умений которыми пользователь владеет (по умолчанию стоит 2)
maxUserSkillsWantsToLearnTagsShown? - максимальное число показанных умений которыми пользователь хочет овладеет (по умолчанию стоит 2)
isExchangeSent? - отправлен ли обмен этому пользователю (true/по умолчанию -> false)
onLikeButtonClicked? - функция которая вызывается при клике на кнопку лайка типа (isUserAdded: boolean) => void;
onMoreCardButtonClick? - функция которая вызывается при клике на кнопку "Подробнее" типа () => void, если не задать функцию, то по умолчанию ведет на страницу /user/:userId (изменить путь можно в shared/constants/global_constants.ts -> paths-userProfilePage) или передать свою функцию

    onExchangeCardButtonClick? -  функция которая вызывается при клике на кнопку "Подробнее" в статусе isExchangeSent=true тип функции () => void;
