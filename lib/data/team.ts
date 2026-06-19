export interface TeamMember {
  id: string;
  name: string;
  role: string;
  quotes: string[];
  show: string;
  avatar: string;
  skills: string[];
  isVacancy: boolean;
  jobType?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 'environment_artist',
    name: 'Could Be You!',
    role: 'Intern Environment Artist',
    quotes: [
      'Mathematical! My worlds are algebraic!',
      'What time is it? ENVIRONMENT TIME!',
      'Oh my glob! These terrains are lumpy space amazing!',
      'Unacceptable level design? UNACCEPTABLE!',
      "Come on grab your brushes, we'll go to very distant lands!",
    ],
    show: 'Adventure Time',
    avatar: '/imgs/team/env_artist.png',
    skills: ['Unity', 'Blender', 'World Building'],
    isVacancy: true,
    jobType: 'Unpaid Internship - Remote',
  },
  {
    id: 'lead_developer',
    name: 'Muammar Yacoob',
    role: 'Lead Developer',
    quotes: [
      'Wubba lubba dub dub! (I am in great coding pain)',
      'Get your sh*t together... get it all together and put it in a backlog.',
      "I'm Pickle Rick! I turned myself into a developer, Morty!",
      'Nobody exists on purpose, nobody codes for a reason, come debug.',
      "And that's the waaaaay the code goes!",
    ],
    show: 'Rick and Morty',
    avatar: '/imgs/team/lead_dev.png',
    skills: ['Unity', 'C#', 'Dad Jokes'],
    isVacancy: false,
  },
  {
    id: 'artist_3d',
    name: 'Maya Rodriguez',
    role: '3D Artist',
    quotes: [
      "Omelette du fromage! (It's all I can model)",
      'Dee Dee! Get out of my laboratory! These renders are delicate!',
      'What does THIS button do? *crashes Blender*',
      'By my calculations, this mesh needs more polygons!',
      'Oh the things I do for art!',
    ],
    show: "Dexter's Laboratory",
    avatar: '/imgs/team/artist.png',
    skills: ['Blender', 'Unity', 'Texture Wizard'],
    isVacancy: false,
  },
  {
    id: 'unity_developer',
    name: 'Jordan Kim',
    role: 'Unity Developer',
    quotes: [
      'OOOOOOHHHHH! That code worked perfectly!',
      'You know who else writes Unity scripts? MY MOM!',
      'Good show! Jolly good show! *after fixing a bug*',
      'WOOOOOAAAHHH! This shader is so cool!',
      'Hmm hmm hmm hmm hmm! *debugging intensifies*',
    ],
    show: 'The Regular Show',
    avatar: '/imgs/team/dev.png',
    skills: ['Unity', 'Shader Graph', 'Bug Hunter'],
    isVacancy: false,
  },
  {
    id: 'project_manager',
    name: 'Sam Patel',
    role: 'Project Manager',
    quotes: [
      'You know who else manages projects? MY MOM!',
      'OOOOOOHHHHH! We shipped on time!',
      'Jolly good show! That sprint went perfectly!',
      'Hmm hmm hmm hmm hmm! *organizing tasks*',
      'Stop talking! We have a standup to run!',
    ],
    show: 'The Regular Show',
    avatar: '/imgs/team/project_manager.png',
    skills: ['Jira Jedi', 'Gantt Charts', 'Deadline Whisperer'],
    isVacancy: false,
  },
  {
    id: 'social_media_wizard',
    name: 'Casey Rivers',
    role: 'Social Media Wizard',
    quotes: [
      'Sugar, spice, and everything nice! Plus viral content!',
      'Fighting trolls and spam by bedtime!',
      'So once again, the algorithm is saved!',
      'The city of Townsville needs more followers!',
      'Using my ultra superpowers... of social media!',
    ],
    show: 'Powerpuff Girls',
    avatar: '/imgs/team/marketing.png',
    skills: ['Social Media', 'Analytics', 'Meme Lord'],
    isVacancy: false,
  },
];
