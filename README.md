## Purpose

Dynamaxed is a graphical editor for the PRET/pokeemerald project in order to make it easier to add, remove and change things like trainers, pokemon, items, etc. It will also come with a full MSYS2 dev environment so you won't need to go through the tedious process of creating one yourself.

It is primarily intended to be an alternative to AdvanceMap for modders who have little to no understanding of C or programming in general and want to get a quick start on modding.

## How it works

This project requires tyranteon/dynamaxed-emerald as a base, which is a slightly modified version of the pret/pokeemerald project. It's modified in a way to allow generated code on one hand while still allowing you to manually modify the rest of the code if you so desire. 

## Development
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn electron:serve
```

### Produces executable
```
yarn electron:build
```

### TODO:

- Auto ID system
- Filter options
- Auto Filtering for Held Items and Trainer usable items
- Drag & Drop Pokemon
- Name length and entity verification
- Undeletable objects
- Trainer Rematches
- Type effectiveness chart
- Display Pokemon Type and Stats

- Serialization for stats
- Entangle Menubar into 3 components
- Dependency Injection for the modules
- return Vue.observable().
- Allow customization of run path
- Get ABGCC into the msys build system
- Move the defaults to dynamaxed-emerald/defaults
- Watch folder and update dynamaxed automatically
- Remove the . from .dynamaxed folder 
- migrate dynamaxed-emerald to the current version
- implement forward button
- auto update and version checking
- Support to edit maps and tilesets
