export default function list2Options(list, labelKey = 'name', valueKey = '_id', convertLabel) {
    if (!list) return [];

    return list.map(listItem => {
        let label = String(listItem[labelKey]);
        const value = String(listItem[valueKey]);

        if (convertLabel) {
            label = convertLabel(label, listItem);
        }

        return { ...listItem, label, value };
    });
}
