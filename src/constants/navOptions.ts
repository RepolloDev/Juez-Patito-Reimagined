export interface Option {
  title: string
  link?: string
  icon?: string
  subOpts?: Option[]
}

export const navOptions: Option[] = [
  {
    title: 'Inicio',
    link: '/content/dashboard',
    icon: 'squares-four',
  },
  {
    title: 'Contenido',
    icon: 'package',
    subOpts: [
      {
        title: 'Problemas',
        link: '/content/problems',
        icon: 'stack',
      },
      {
        title: 'Concursos',
        link: '/content/contests',
        icon: 'calendar-star',
      },
      {
        title: 'Ranking',
        link: '/content/ranking',
        icon: 'ranking',
      },
      {
        title: 'Envíos',
        link: '/content/submissions',
        icon: 'paper-plane-tilt',
      },
    ],
  },
  {
    title: 'Ayuda',
    link: '/others/help',
    icon: 'question',
  },
  {
    title: 'Más',
    icon: 'dots-three-circle-vertical',
    subOpts: [
      {
        title: 'Sobre JPR',
        link: '/others/about',
        icon: 'info',
      },
      {
        title: 'Preguntas Frecuentes',
        link: '/others/faq',
        icon: 'chats',
      },
      {
        title: 'Noticias',
        link: '/news',
        icon: 'newspaper',
      },
      {
        title: 'Blog',
        link: '/blog',
        icon: 'article',
      },
      {
        title: 'Contacto',
        link: 'mailto:samuel.loza26@gmail.com',
        icon: 'mailbox',
      },
    ],
  },
]
