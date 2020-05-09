import React, {useCallback, useMemo, useState} from "react";
import {Avatar, Select, Spin} from "antd";
import {SearchItem} from "../../data/request.type";
import {searchStudents} from "../../data/student";
import {StudentPreview} from "../../data/student/types";

const {Option} = Select
const TRIGGER_LENGTH = 2;

type StudentSelectorProps = {
    onChange: (id: number[]) => void
    defaultValues?: StudentPreview[]
}

const studentsParser = (students: StudentPreview[]): SearchItem[] => {
    return students.map(s => ({
            id: s.id,
            type: "STUDENT",
            name: s.firstName + ' ' + s.lastName,
            description: "",
            thumbURL: s.picture,
            status: true
        })
    );
};

const StudentTag: React.FC<{data: SearchItem}> = ({data}) => (
    <><Avatar icon="user" src={data.thumbURL} size={18} className="mr-2 my-1 box-border"/> {data.name}</>
)

const StudentSelector: React.FC<StudentSelectorProps> = ({onChange, defaultValues = []}) => {
    const [options, setOptions] = useState<SearchItem[]>([]);
    const defaultTags = useMemo(() => {
        return studentsParser(defaultValues).map(v => ({
            key: v.id,
            label: <StudentTag data={v} />
        }));

    }, [defaultValues])
    const [fetching, setFetching] = useState<boolean>(false);

    const handleSearch = useCallback((value: string) => {
        if (value.length > TRIGGER_LENGTH) {
            setFetching(true)
            searchStudents(value).then(res => {
                if (res.status === 200) {
                    setOptions(res.data);
                }
            }).finally(() => setFetching(false));
        } else {
            setOptions([]);
        }
    }, []);

    return (
        <Select
            mode="multiple"
            showSearch
            placeholder="Aucun administrateur (déconseillé) "
            defaultActiveFirstOption={false}
            labelInValue
            defaultValue={defaultTags}
            showArrow={false}
            filterOption={false}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            onSearch={handleSearch}
            onChange={(selected: { key: number }[]) => {
                setOptions([])
                setFetching(false);
                onChange((selected.map(s => s.key)))
            }}
            className="w-full "
        >
            {options.map(o =>
                <Option key={o.id} value={o.id}>
                    <StudentTag data={o} />
                </Option>
            )}
        </Select>
    )
}

export default StudentSelector