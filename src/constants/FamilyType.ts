enum FamilyType {
    YELLOW_EAGLE="YELLOW_EAGLE",
    GREEN_GORILLA="GREEN_GORILLA",
    ORANGE_TIGER="ORANGE_TIGER",
    RED_FOX="RED_FOX",
    WHITE_PANDA="WHITE_PANDA",
    BLACK_RHINO="BLACK_RHINO",
    GRAY_BEAR="GRAY_BEAR",
    BLUE_LION="BLUE_LION",
}

export default  FamilyType

const familyNames = Object.fromEntries(
    Object.entries(FamilyType)
        .map(([k, v]) => [k, v.split("_").map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(" ")])
)

const familyColors = {
    YELLOW_EAGLE: { color: "#FFD700", textColor: "#000000" },
    GREEN_GORILLA: { color: "#008000", textColor: "#FFFFFF" },
    ORANGE_TIGER: { color: "#FFA500", textColor: "#000000" },
    RED_FOX: { color: "#FF0000", textColor: "#FFFFFF" },
    WHITE_PANDA: { color: "#FFFFFF", textColor: "#000000" },
    BLACK_RHINO: { color: "#000000", textColor: "#FFFFFF" },
    GRAY_BEAR: { color: "#808080", textColor: "#FFFFFF" },
    BLUE_LION: { color: "#0000FF", textColor: "#FFFFFF" },
}

export { familyNames, familyColors }