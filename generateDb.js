const MAX_CHILDREN = 5;
const INITIAL_POPULATION = 20;
const SEED_RATIO = .8;

const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const FIRST_NAMES = [
  "Merlin", "Angella", "Saran", "Jesica", "Dessie", "Elroy", "Alexis", "Monroe", "Keiko", "Sherlene",
  "Maile", "Treasa", "Erick", "Katerine", "Margarite", "Scarlett", "Rubie", "Conrad", "Dorian",
  "Stephenie", "Dorine", "Mellisa", "Waneta", "Wilburn", "Carline", "Tierra", "Lucinda", "Adelia",
  "Lemuel", "Cortez", "Terrance", "Holly", "Pearl", "Ria", "Chadwick", "Margit", "Hattie", "Ruthe",
  "Annabell", "Alejandrina", "Samara", "Lynelle", "Jacquelyn", "Elouise", "Victoria", "Tu", "Leonarda",
  "Marilyn", "Eula", "Lorina", "Evita", "Monserrate", "Gaye", "Agustin", "Santina", "Katherin",
  "Carlyn", "Mardell", "Billie", "Gretta", "Anya", "Minh", "Lydia", "Hilde", "Elba", "Rebecka",
  "Maisie", "Kirby", "Phillis", "Leeann", "Darrel", "Vivienne", "Qiana", "Martin", "Nicki", "Iris",
  "Demarcus", "Marcus", "Venus", "Leonia", "Madelaine", "Avery", "Muriel", "Arnetta", "Terra", "Raphael",
  "Trenton", "Harriette", "Arlie", "Michaela", "Miguel", "Rivka", "Etta", "Loma", "Edris", "Leigha",
  "Arturo", "Shamika", "Domenica", "Yun", "Carmella", "Ruthie", "Obdulia", "Amelia", "Letha", "Arica",
  "Colin", "Keena", "Danielle", "Iluminada", "Jonna", "Nilda", "Enda", "Alan", "Marquitta", "Lynetta",
  "Graig", "Elias", "Markus", "Glennis", "Michele"
];

const LAST_NAMES = [
  "Modlin", "Stearn", "Galiano", "Ruck", "Vannote", "Laning", "Gourd", "Lattimore", "Gulledge", "Lainez",
  "Treanor", "Mcmurtry", "Behler", "Pittman", "Rogue", "Ohm", "Ratliff", "Arvie", "Lamacchia", "Brannigan",
  "Bertram", "Holston", "Lehmann", "Laffoon", "Conger", "Linehan", "Ates", "Taranto", "Dill", "Wedgeworth",
  "Carlow", "Uhrig", "Traub", "Henke", "Singler", "Boros", "Grijalva", "Heyd", "Gamache", "Kulig", "Chasse",
  "Riebel", "Patty", "Lasiter", "Whitten", "Sauve", "Laurie", "Dant", "Lomas", "Stclair", "Yap", "Stefan",
  "Leja", "Drake", "Rasch", "Oltman", "Delillo", "Rhines", "Tardy", "Cleghorn", "Canning", "Capetillo",
  "Penland", "Boggess", "Cerniglia", "Paradiso", "Alcon", "Furniss", "Mounce", "Hao", "Hirsch", "Rankins",
  "Waite", "Dentler", "Rimmer", "Exum", "Knotts", "Maloy", "Oney", "Kimberly", "Paulin", "Whitelaw", "Fusaro",
  "Hinson", "Weight", "Omara", "Haffner", "Galle", "Ortegon", "Kinslow", "Morehead", "Ohler", "Coby", "Wayman",
  "Rowse", "Germano", "Motes", "Raimondi", "Texada", "Scofield", "Weide", "Gulotta", "Hugo", "Gilsdorf",
  "Zambrano", "Peralta", "Thistle", "Minnis", "Lanz", "More", "Dupre", "Cleek", "Whitelow", "Stelling",
  "Anello", "Lindstrom", "Zahler", "Niccum", "Difalco", "Mendicino", "Reaux"
];

const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const flatten = a => a.reduce((acc, arr) => ([...acc, ...arr]), []);
const sample = iterable => () => iterable[Math.floor(Math.random() * iterable.length)];
const randomId = () => Array(10).fill(null).map(sample(ID_CHARS)).join('');
const randomFirstName = sample(FIRST_NAMES);
const randomLastName = sample(LAST_NAMES);
const randomPerson = (lastName) => () => ({
  id: randomId(),
  children: [],
  firstName: randomFirstName(),
  lastName: lastName ||randomLastName()
});
const randomPeople = count => Array(count).fill(null).map(randomPerson());

const initialGenerations = [randomPeople(INITIAL_POPULATION)]
const randomFamily = (generationCount, generations = initialGenerations) => {
  if (generations.length === generationCount) return flatten(generations);
  const [ curGeneration, ...oldGenerations ] = generations;

  // Not checking for incest because it's complicated / not MVP
  const shuffledGen = shuffle(curGeneration);

  const numParentalPairs = Math.floor(shuffledGen.length * SEED_RATIO / 2);
  const parentalPairs = Array(numParentalPairs).fill(null).map((_, idx) => [shuffledGen[idx * 2], shuffledGen[(idx * 2) + 1]]);

  const nextGeneration = parentalPairs.reduce((acc, parents) => {
    const familyName = sample(parents)().lastName;
    const childCount = Math.floor(Math.random() * MAX_CHILDREN) + 1;

    const children = Array(childCount).fill(null).map(randomPerson(familyName));

    const childIds = children.map(c => c.id);
    // Mutating here because its much easier
    parents.forEach(p => { p.children = childIds; });

    return [...acc, ...children];
  }, []);

  return randomFamily(generationCount, [nextGeneration, ...generations]);
}

console.log(JSON.stringify(randomFamily(10)));
