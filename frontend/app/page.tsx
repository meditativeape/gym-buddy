'use client';

import React, { useState } from 'react';
import { CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined, SaveOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, InputNumber, Layout, List, Modal, Space, Table, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { DeleteItemSpec, Exercise, ExerciseSet, Workout } from './interfaces';
import { workouts as sampleWorkouts } from './data';
import { addOrUpdateWorkout, createNewWorkout, copyWorkout, copyWorkouts, deleteWorkoutItem, formatDate, formatExerciseSets, formatWorkoutShortDesc, formatWorkoutTitle } from './util';

interface WorkoutsSummaryProps {
  workouts: Workout[];
  setWorkoutToEdit: any;
}

interface EditExerciseSetProps {
  set: ExerciseSet;
  onSave: (set: ExerciseSet) => void;
  onDeleteClick: any;
}

interface EditExerciseProps {
  workout: Workout;
  exercise: Exercise;
  setWorkout: any;
  onDeleteClick: any;
}

interface EditWorkoutProps {
  workouts: Workout[];
  workoutToEdit: Workout;
  setWorkouts: any;
  setWorkoutToEdit: any;
}

interface WorkoutSummaryListItemProps {
  workout: Workout;
  setWorkoutToEdit: any;
}

interface WorkoutColumnDataType {
  key: number;
  exercise: string;
  sets: string;
  isSuperset: boolean;
}

const { Header, Content, Footer, Sider } = Layout;



const WorkoutSummaryListItem : React.FC<WorkoutSummaryListItemProps> = ({ workout, setWorkoutToEdit }) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const columns: ColumnsType<WorkoutColumnDataType> = [
    {
      title: 'Exercise',
      dataIndex: 'exercise',
      key: 'exercise',
    },
    {
      title: 'Sets',
      dataIndex: 'sets',
      key: 'sets',
    },
    {
      title: 'Superset?',
      dataIndex: 'isSuperset',
      key: 'isSuperset',
      render: (flag) => flag ? "Y" : "",
    },
  ];

  const summary = (
    <List.Item
      actions={[
        <Button size="middle" type="text" shape="circle" icon={<DownOutlined />} key={`${workout.id}-show-more`} onClick={() => setShowMore(true)} />,
        <Button size="middle" type="text" shape="circle" icon={<EditOutlined />} key={`${workout.id}-edit`} onClick={() => setWorkoutToEdit(copyWorkout(workout))} />,
      ]}
    >
      <List.Item.Meta
        title={formatWorkoutTitle(workout)}
        description={formatWorkoutShortDesc(workout)}
      />
    </List.Item>
  );

  const details = (
    <List.Item
      actions={[
        <Button size="middle" type="text" shape="circle" icon={<UpOutlined />} key={`${workout.id}-show-less`} onClick={() => setShowMore(false)} />,
        <Button size="middle" type="text" shape="circle" icon={<EditOutlined />} key={`${workout.id}-edit`} onClick={() => setWorkoutToEdit(copyWorkout(workout))} />,
      ]}
    >
      <List.Item.Meta
        title={formatWorkoutTitle(workout)}
      />
      <Table 
        columns={columns} 
        dataSource={workout.exercises.map((exercise) => {
          return {
            key: exercise.id,
            exercise: exercise.name,
            sets: formatExerciseSets(exercise.sets),
            isSuperset: workout.supersets.indexOf(exercise.id) != -1,
          }
        })}
        pagination={false}
      />
    </List.Item>
  );

  return showMore ? details : summary;
};

const WorkoutsSummaryList: React.FC<WorkoutsSummaryProps> = ({ workouts, setWorkoutToEdit }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={workouts}
      className='workouts-summary'
      renderItem={(item: Workout) => (
        <WorkoutSummaryListItem workout={item} setWorkoutToEdit={setWorkoutToEdit} />
      )}
    />
  );
};

const EditExerciseSetSpace: React.FC<EditExerciseSetProps> = ({ set, onSave, onDeleteClick }) => {
  const [editing, setEditing] = useState(false);
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);
  const id = set.id;

  const handleSave = () => {
    onSave({ id, weight, reps });
    setEditing(false);
  };

  const handleCancel = () => {
    setWeight(set.weight);
    setReps(set.reps);
    setEditing(false);
  };

  return editing ? (
    <Space>
      <InputNumber min={1} value={weight} onChange={value => value && setWeight(value)} placeholder="Weight (lbs)" />
      <InputNumber min={1} value={reps} onChange={value => value && setReps(value)} placeholder="Reps" />
      <Button size="small" type="text" icon={<SaveOutlined />} onClick={handleSave} />
      <Button size="small" type="text" icon={<CloseOutlined />} onClick={handleCancel} />
    </Space>
  ) : (
    <Space>
      <span>{weight} lbs</span>
      <span>{reps} reps</span>
      <Button size="small" type="text" icon={<EditOutlined />} onClick={() => setEditing(true)} />
      <Button size="small" type="text" icon={<DeleteOutlined />} onClick={onDeleteClick} />
    </Space>
  );
};

const EditExerciseCard: React.FC<EditExerciseProps> = ({ workout, exercise, setWorkout, onDeleteClick }) => {
  const handleSetChange = (updatedSet: ExerciseSet) => {
    const newWorkout = copyWorkout(workout);
    const exerciseIdx = newWorkout.exercises.findIndex(item => item.id == exercise.id);
    const setIdx = newWorkout.exercises[exerciseIdx].sets.findIndex(item => item.id == updatedSet.id);
    newWorkout.exercises[exerciseIdx].sets[setIdx] = updatedSet;
    setWorkout(newWorkout);
  };

  return (
    <Card 
      title={exercise.name}
      actions={[
        <PlusOutlined key="add" />,
        <EditOutlined key="edit" />,
        <DeleteOutlined key="delete" onClick={() => onDeleteClick(exercise.id)} />,
      ]}
      >
      <List
        dataSource={exercise.sets}
        renderItem={(set, _) => (
          <List.Item key={set.id}>
            <EditExerciseSetSpace 
              set={set}
              onSave={handleSetChange}
              onDeleteClick={() => onDeleteClick(exercise.id, set.id)}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

const EditWorkoutView: React.FC<EditWorkoutProps> = ({ workouts, workoutToEdit, setWorkouts, setWorkoutToEdit }) => {
  const [workout, setWorkout] = useState<Workout>(workoutToEdit);
  const [itemToDelete, setItemToDelete] = useState<DeleteItemSpec>({
    exerciseId: -1,
    exerciseSetId: -1,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleSaveWorkout = () => {
    const newWorkouts = copyWorkouts(workouts);
    addOrUpdateWorkout(newWorkouts, workout);
    setWorkouts(newWorkouts);
    setWorkoutToEdit(null);
  };

  const handleDeleteClick = (exerciseId?: number, exerciseSetId? : number) => {
    setItemToDelete({
      exerciseId: exerciseId ? exerciseId : -1,
      exerciseSetId: exerciseSetId ? exerciseSetId : -1,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOk = () => {
    const newWorkout = copyWorkout(workout);
    deleteWorkoutItem(newWorkout, itemToDelete);
    setWorkout(newWorkout);
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <List
        dataSource={workout.exercises}
        renderItem={(exercise, _) => (
          <List.Item>
            <EditExerciseCard
              key={exercise.id}
              workout={workout}
              exercise={exercise} 
              setWorkout={setWorkout}
              onDeleteClick={handleDeleteClick} 
            />
          </List.Item>
        )}
      />
      <Button type="default">Add Workout</Button>
      <Button type="primary" onClick={handleSaveWorkout}>Save</Button>
      <Button type="default" onClick={() => setWorkoutToEdit(null)}>Cancel</Button>
      <Modal title="Confirm Delete" open={isDeleteModalOpen} onOk={handleDeleteOk} onCancel={() => setIsDeleteModalOpen(false)}>
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </div>
  );
};

const MainContent: React.FC<{ colorBgContainer: string }> = ({ colorBgContainer }) => {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);

  return (
    <div>
      <Content className="site-layout" style={{ padding: '0 2rem' }}>
        {workoutToEdit ? (
          <EditWorkoutView workouts={workouts} setWorkouts={setWorkouts} workoutToEdit={workoutToEdit} setWorkoutToEdit={setWorkoutToEdit} />
        ) : (
          <div style={{ padding: '0 1rem', minHeight: 720, background: colorBgContainer, color: 'black'}}>
            <WorkoutsSummaryList workouts={workouts} setWorkoutToEdit={setWorkoutToEdit}/>
            {/* Fix workoutToEdit ID */}
            <Button size="large" type="default" shape="circle" icon={<PlusOutlined />} 
              onClick={() => setWorkoutToEdit(createNewWorkout(workouts[workouts.length - 1].id + 1))} 
            />
          </div>
        )}
      </Content>
    </div>
  )
};

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100dvh' }}>
      {/* <Sider
        breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
            (icon, index) => ({
              key: String(index + 1),
              icon: React.createElement(icon),
              label: `nav ${index + 1}`,
            }),
          )}
        />
      </Sider> */}
      <Layout style={{ position: 'relative' }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <MainContent colorBgContainer={ colorBgContainer } />
      </Layout>
    </Layout>
  );
};

export default App;
