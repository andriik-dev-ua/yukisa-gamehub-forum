require('dotenv').config();
const { sequelize, User, Category, Thread, Post, Like } = require('./models');

const categories = [
  { name: 'FPS / Strzelanki', description: 'Counter-Strike, Valorant, Call of Duty, Battlefield i inne strzelanki.', icon: '🔫', color: '#ef4444', order: 1 },
  { name: 'RPG', description: 'Wiedźmin, Baldur\'s Gate, Final Fantasy, Skyrim — gry fabularne.', icon: '⚔️', color: '#8b5cf6', order: 2 },
  { name: 'MMO / MMORPG', description: 'World of Warcraft, Lost Ark, Guild Wars — gry online wieloosobowe.', icon: '🌍', color: '#06b6d4', order: 3 },
  { name: 'Strategiczne', description: 'Civilization, Age of Empires, StarCraft — strategie.', icon: '🏰', color: '#f59e0b', order: 4 },
  { name: 'Sportowe / Wyścigi', description: 'FIFA, NBA 2K, Forza Horizon, Gran Turismo.', icon: '⚽', color: '#22c55e', order: 5 },
  { name: 'Indie', description: 'Hades, Celeste, Hollow Knight — perełki niezależne.', icon: '💎', color: '#ec4899', order: 6 },
  { name: 'Mobile', description: 'Genshin Impact, PUBG Mobile, Clash Royale — gry mobilne.', icon: '📱', color: '#14b8a6', order: 7 },
  { name: 'Retro / Klasyki', description: 'Mario, Zelda, Doom, Tetris — gry retro i klasyczne.', icon: '🕹️', color: '#a855f7', order: 8 },
  { name: 'Ogólne / Off-topic', description: 'Dyskusje ogólne, przedstaw się, pytania.', icon: '💬', color: '#6366f1', order: 9 },
];

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Baza danych wyczyszczona i zsynchronizowana.');

    // Users
    const admin = await User.create({
      username: 'Admin',
      email: 'admin@gamestopdev.pl',
      password: 'admin123',
      role: 'admin',
      bio: 'Administrator forum GameStopDev.',
      points: 100,
    });

    const user1 = await User.create({
      username: 'GamerPL',
      email: 'gamer@gamestopdev.pl',
      password: 'test1234',
      role: 'user',
      bio: 'Gram we wszystko co się rusza!',
      points: 45,
    });

    const user2 = await User.create({
      username: 'RetroFan',
      email: 'retro@gamestopdev.pl',
      password: 'test1234',
      role: 'user',
      bio: 'Fan gier retro i klasycznych tytułów.',
      points: 30,
    });

    const mod = await User.create({
      username: 'Moderator',
      email: 'mod@gamestopdev.pl',
      password: 'mod12345',
      role: 'moderator',
      bio: 'Moderator forum GameStopDev.',
      points: 60,
    });

    console.log('Użytkownicy utworzeni.');

    // Categories
    const cats = await Category.bulkCreate(categories);
    console.log('Kategorie utworzone.');

    // Threads
    const threads = [
      {
        title: 'Witamy na forum GameStopDev!',
        content: 'Cześć! Witamy na naszym forum gamingowym GameStopDev. To miejsce stworzone dla graczy, przez graczy. Przedstawcie się i opowiedzcie o swoich ulubionych grach!\n\nForum zostało stworzone przez Andriia Kondratiuka w ramach projektu szkolnego w CKZiU NR.2 "Mechanik" w Raciborzu.\n\nZapraszamy do dyskusji!',
        userId: admin.id,
        categoryId: cats[8].id,
        isPinned: true,
      },
      {
        title: 'CS2 vs Valorant — co lepsze?',
        content: 'Wiadomo, że oba to topowe strzelanki, ale który tytuł jest Waszym zdaniem lepszy? CS2 z jego mechaniką i historią, czy Valorant z agentami i umiejętnościami? Piszcie swoje opinie!',
        userId: user1.id,
        categoryId: cats[0].id,
        views: 42,
      },
      {
        title: 'Najlepsze RPG 2025/2026',
        content: 'Jakie RPGi polecacie w tym roku? Szukam czegoś z dobrą fabułą i ciekawym systemem walki. Grałem już w Baldur\'s Gate 3 i szukam czegoś nowego.',
        userId: user2.id,
        categoryId: cats[1].id,
        views: 28,
      },
      {
        title: 'WoW czy FFXIV — który MMO wybrać?',
        content: 'Chcę zacząć grać w jakieś MMO, ale nie wiem które wybrać. WoW ma legendarne dungeony, ale FFXIV ma świetną historię. Co polecacie dla kogoś, kto nigdy nie grał w MMO?',
        userId: user1.id,
        categoryId: cats[2].id,
        views: 15,
      },
      {
        title: 'Hollow Knight: Silksong — kiedy premiera?',
        content: 'Czy ktoś ma jakieś wieści o Silksong? Czekam na tę grę od lat. Pierwsza część była absolutnym arcydziełem!',
        userId: user2.id,
        categoryId: cats[5].id,
        views: 55,
      },
    ];

    const createdThreads = [];
    for (const t of threads) {
      const thread = await Thread.create(t);
      createdThreads.push(thread);
    }
    console.log('Wątki utworzone.');

    // Posts
    const posts = [
      { content: 'Świetna inicjatywa! Cieszę się, że mamy nowe forum dla graczy. 🎮', userId: user1.id, threadId: createdThreads[0].id },
      { content: 'CS2 na zawsze! Nic nie pobije tej mechaniki strzelania.', userId: user2.id, threadId: createdThreads[1].id },
      { content: 'Moim zdaniem Valorant jest bardziej dostępny dla nowych graczy. Ale CS2 ma wyższy skill ceiling.', userId: mod.id, threadId: createdThreads[1].id },
      { content: 'Polecam sprawdzić Elden Ring jeśli jeszcze nie grałeś. To jedno z najlepszych RPG ostatnich lat!', userId: user1.id, threadId: createdThreads[2].id },
      { content: 'FFXIV ma świetną społeczność, ale WoW ma lepszy endgame content. Zależy co cenisz bardziej.', userId: admin.id, threadId: createdThreads[3].id },
      { content: 'Tak samo czekam! Hollow Knight to perełka i Silksong zapowiada się jeszcze lepiej.', userId: user1.id, threadId: createdThreads[4].id },
      { content: 'Mam nadzieję, że w tym roku się doczekamy. Team Cherry milczy jak zwykle...', userId: mod.id, threadId: createdThreads[4].id },
    ];

    for (const p of posts) {
      await Post.create(p);
    }
    console.log('Posty (odpowiedzi) utworzone.');

    // Likes
    await Like.bulkCreate([
      { userId: user1.id, threadId: createdThreads[0].id },
      { userId: user2.id, threadId: createdThreads[0].id },
      { userId: mod.id, threadId: createdThreads[0].id },
      { userId: user1.id, threadId: createdThreads[4].id },
      { userId: user2.id, threadId: createdThreads[1].id },
    ]);
    console.log('Polubienia utworzone.');

    console.log('\n--- DANE DOSTĘPOWE ---');
    console.log('Admin:     admin@gamestopdev.pl / admin123');
    console.log('Moderator: mod@gamestopdev.pl   / mod12345');
    console.log('User 1:    gamer@gamestopdev.pl / test1234');
    console.log('User 2:    retro@gamestopdev.pl / test1234');
    console.log('---\n');

    console.log('Seed zakończony pomyślnie!');
    process.exit(0);
  } catch (error) {
    console.error('Błąd seedowania:', error);
    process.exit(1);
  }
};

seed();
