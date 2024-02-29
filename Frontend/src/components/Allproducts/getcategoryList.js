import axios from "axios";

export const getAllCategories =  async ()=>{
    try {
        const resp = await axios.get(`${process.env.REACT_APP_BASE_URL}/getAllSubCategories`)
        return resp.data
    } catch (error) {
        return error
    }
}

export const separateCategories = (categories) => {
    let level1 = [];
    let level2 = [];
    let level3 = [];

    Array.isArray(categories) && categories.forEach(category => {
        level1.push({name: category.name, id: category.id});
        if (category.children) {
            category.children.forEach(child => {
                level2.push({name: child.name, id: child.id});
                if (child.children) {
                    child.children.forEach(grandChild => {
                        level3.push({name: grandChild.name, id: grandChild.id});
                    });
                }
            });
        }
    });

    return {level1, level2, level3};
}
