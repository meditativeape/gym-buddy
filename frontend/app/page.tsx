'use client';

import React, { useState, useReducer } from 'react';
import { CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined, PlusOutlined, SaveOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Input, InputNumber, Layout, List, Modal, Space, Table, theme } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { ColumnsType } from 'antd/es/table';

import { DeleteItemSpec, Exercise, ExerciseSet, Workout } from './interfaces';
import { workouts as sampleWorkouts } from './data';
import { createWorkout, formatExerciseSets, formatWorkoutShortDesc, formatWorkoutTitle, workoutReducer, workoutsReducer } from './util';


interface WorkoutsSummaryProps {
  workouts: Workout[];
  setWorkoutToEdit: any;
}

interface EditExerciseSetProps {
  set: ExerciseSet;
  editing: boolean;
  onSave: (set: ExerciseSet) => void;
  onDeleteClick: any;
  setEditingId: any;
}

interface EditExerciseProps {
  workout: Workout;
  exercise: Exercise;
  workoutDispatch: any;
  onDeleteClick: any;
}

interface EditWorkoutProps {
  workouts: Workout[];
  workoutToEdit: Workout;
  workoutsDispatch: any;
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

const { Header, Content } = Layout;

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
        <Button size="middle" type="text" shape="circle" icon={<EditOutlined />} key={`${workout.id}-edit`} onClick={() => setWorkoutToEdit(workout)} />,
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
        <Button size="middle" type="text" shape="circle" icon={<EditOutlined />} key={`${workout.id}-edit`} onClick={() => setWorkoutToEdit(workout)} />,
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

const EditExerciseSetSpace: React.FC<EditExerciseSetProps> = ({ set, editing, onSave, onDeleteClick, setEditingId }) => {
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);
  const id = set.id;

  const handleSave = () => {
    onSave({ id, weight, reps });
    setEditingId(-1);
  };

  const handleCancel = () => {
    setWeight(set.weight);
    setReps(set.reps);
    setEditingId(-1);
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
      <Button size="small" type="text" icon={<EditOutlined />} onClick={() => setEditingId(id)} />
      <Button size="small" type="text" icon={<DeleteOutlined />} onClick={onDeleteClick} />
    </Space>
  );
};

const EditExerciseCard: React.FC<EditExerciseProps> = ({ workout, exercise, workoutDispatch, onDeleteClick }) => {
  const [exerciseName, setExerciseName] = useState(exercise.name);
  const [editingId, setEditingId] = useState(-1);
  const [editingExerciseName, setEditingExerciseName] = useState(false);

  const handleUpdateExerciseSet = (updatedSet: ExerciseSet) => {
    workoutDispatch({
      type: 'updateExerciseSet',
      exerciseId: exercise.id,
      exerciseSet: updatedSet,
    });
  };

  const handleAddExerciseSet = () => {
    const newSet: ExerciseSet = {id: 1, weight: 0, reps: 0};
    if (exercise.sets.length > 0) {
      const lastSet = exercise.sets[exercise.sets.length - 1];
      newSet.id = lastSet.id + 1;
      newSet.weight = lastSet.weight;
      newSet.reps = lastSet.reps;
    }
    workoutDispatch({
      type: 'addExerciseSet',
      exerciseId: exercise.id,
      exerciseSet: newSet,
    });
    setEditingId(newSet.id);
  };

  const handleSaveExerciseName = () => {
    workoutDispatch({
      type: 'updateExerciseName',
      exerciseId: exercise.id,
      exerciseName: exerciseName,
    });
    setEditingExerciseName(false);
  };

  const handleCancelExerciseName = () => {
    setExerciseName(exercise.name);
    setEditingExerciseName(false);
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      workoutDispatch({
        type: 'addSuperset',
        exerciseId: exercise.id,
      });
    } else {
      workoutDispatch({
        type: 'deleteSuperset',
        exerciseId: exercise.id,
      });
    }
  };

  return (
    <Card 
      title={editingExerciseName ? 
        <Space>
          <Input value={exerciseName} onChange={e => setExerciseName(e.target.value)} placeholder="Exercise Name" />
          <Button size="small" type="text" icon={<SaveOutlined />} onClick={handleSaveExerciseName} />
          <Button size="small" type="text" icon={<CloseOutlined />} onClick={handleCancelExerciseName} />
        </Space>
        : exercise.name}
      actions={[
        <PlusOutlined key="add" onClick={handleAddExerciseSet}/>,
        <EditOutlined key="edit" onClick={() => setEditingExerciseName(true)}/>,
        <DeleteOutlined key="delete" onClick={() => onDeleteClick(exercise.id)} />,
      ]}
      >
      <List
        dataSource={exercise.sets}
        renderItem={(set, _) => (
          <List.Item key={set.id}>
            <EditExerciseSetSpace
              set={set}
              editing={editingId === set.id}
              onSave={handleUpdateExerciseSet}
              onDeleteClick={() => onDeleteClick(exercise.id, set.id)}
              setEditingId={setEditingId}
            />
          </List.Item>
        )}
      />
      <Checkbox checked={workout.supersets.findIndex(item => item === exercise.id) !== -1} onChange={handleCheckboxChange}>Is Superset</Checkbox>
    </Card>
  );
};

const EditWorkoutView: React.FC<EditWorkoutProps> = ({ workouts, workoutToEdit, workoutsDispatch, setWorkoutToEdit }) => {
  const [workout, workoutDispatch] = useReducer(workoutReducer, workoutToEdit);
  const [itemToDelete, setItemToDelete] = useState<DeleteItemSpec>({
    exerciseId: -1,
    exerciseSetId: -1,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleSaveWorkout = () => {
    workoutsDispatch({
      type: 'updateWorkout',
      workout: workout,
    });
    setWorkoutToEdit(null);
  };

  const handleAddExercise = () => {
    workoutDispatch({
      type: 'addExercise', 
      exerciseName: 'Beck'
    });
  };

  const handleDeleteClick = (exerciseId?: number, exerciseSetId? : number) => {
    setItemToDelete({
      exerciseId: exerciseId ? exerciseId : -1,
      exerciseSetId: exerciseSetId ? exerciseSetId : -1,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOk = () => {
    if (itemToDelete.exerciseId > -1) {
      if (itemToDelete.exerciseSetId > -1) {
        workoutDispatch({
          type: 'deleteExerciseSet',
          exerciseId: itemToDelete.exerciseId,
          exerciseSetId: itemToDelete.exerciseSetId,
        });
      } else {
        workoutDispatch({
          type: 'deleteExercise',
          exerciseId: itemToDelete.exerciseId,
        });
      }
    }
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
              workoutDispatch={workoutDispatch}
              onDeleteClick={handleDeleteClick} 
            />
          </List.Item>
        )}
      />
      <Button type="default" onClick={handleAddExercise}>Add Exercise</Button>
      <Button type="primary" onClick={handleSaveWorkout}>Save</Button>
      <Button type="default" onClick={() => setWorkoutToEdit(null)}>Cancel</Button>
      <Modal title="Confirm Delete" open={isDeleteModalOpen} onOk={handleDeleteOk} onCancel={() => setIsDeleteModalOpen(false)}>
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </div>
  );
};

const MainContent: React.FC<{ colorBgContainer: string }> = ({ colorBgContainer }) => {
  const [workouts, workoutsDispatch] = useReducer(workoutsReducer, sampleWorkouts);
  const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);

  const handleAddWorkout = () => {
    const workoutId = Math.max(...workouts.map(w => w.id)) + 1;
    setWorkoutToEdit(createWorkout(workoutId, "New Workout"));
  };

  return (
    <div>
      <Content className="site-layout" style={{ padding: '0 2rem' }}>
        {workoutToEdit ? (
          <EditWorkoutView workouts={workouts} workoutsDispatch={workoutsDispatch} workoutToEdit={workoutToEdit} setWorkoutToEdit={setWorkoutToEdit} />
        ) : (
          <div style={{ padding: '0 1rem', minHeight: 720, background: colorBgContainer, color: 'black'}}>
            <WorkoutsSummaryList workouts={workouts} setWorkoutToEdit={setWorkoutToEdit} />
            <Button size="large" type="default" shape="circle" icon={<PlusOutlined />} onClick={handleAddWorkout} />
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
      <Layout style={{ position: 'relative' }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <MainContent colorBgContainer={ colorBgContainer } />
      </Layout>
    </Layout>
  );
};

export default App;
