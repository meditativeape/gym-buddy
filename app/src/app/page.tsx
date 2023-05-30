'use client';

import React, { useState } from 'react';
import { DownOutlined, EditOutlined, SaveOutlined, UploadOutlined, UpOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Divider, Input, InputNumber, Layout, List, Menu, Space, Skeleton, theme } from 'antd';

import { Exercise, ExerciseSet, Superset, Workout } from './interfaces';
import { workouts as sampleWorkouts } from './data';

interface WorkoutsSummaryProps {
  workouts: Workout[];
  setWorkoutToEdit: any;
}

interface EditExerciseProps {
  exercise: Exercise;
  onExerciseChange: (exercise: Exercise) => void;
}

interface EditWorkoutProps {
  workouts: Workout[];
  workoutToEdit: number;
  setWorkouts: any;
  setWorkoutToEdit: any;
}

interface WorkoutSummaryListItemProps {
  workout: Workout;
  setWorkoutToEdit: any;
}

const { Header, Content, Footer, Sider } = Layout;

const createNewWorkout: (id: number) => Workout = (id) => {
  return {
    id: id,
    date: new Date(),
    name: "New Workout",
    exercises: [],
    supersets: [],
  };
};

const copyExercise: (exercise: Exercise) => Exercise = (exercise) => {
  const exerciseCopy: Exercise = {
    ...exercise,
    sets: exercise.sets.map((s) => {
      return {
        weight: s.weight,
        reps: s.reps,
      }
    }),
  };
  return exerciseCopy;
}

const copyWorkout: (workout: Workout) => Workout = (workout) => {
  const workoutCopy: Workout = {
    ...workout,
    exercises: workout.exercises.map((e) => copyExercise(e)),
    supersets: [],  // TODO: copy properly
  }
  return workoutCopy;
};

const formatDate = (date: Date) => {
  const month = date.getMonth() + 1; // Months are 0-11 in JavaScript
  const day = date.getDate();

  // Pad the month and day with leading zeros if necessary
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');

  return paddedMonth + '/' + paddedDay;
}


const WorkoutSummaryListItem : React.FC<WorkoutSummaryListItemProps> = (props) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  const formatWorkoutTitle = (workout: Workout) => formatDate(workout.date) + " " + workout.name;
  const formatWorkoutShortDesc = (workout: Workout) => workout.exercises.map(exercise => exercise.name).join(', ');

  const summary = (
    <List.Item
      actions={[
        <Button size="middle" type="text" shape="circle" icon={<DownOutlined />} onClick={() => setShowMore(true)} />,
        <Button size="middle" type="text" shape="circle" icon={<EditOutlined />} onClick={() => props.setWorkoutToEdit(props.workout.id)} />,
      ]}
    >
      <List.Item.Meta
        title={formatWorkoutTitle(props.workout)}
        description={formatWorkoutShortDesc(props.workout)}
      />
    </List.Item>
  );

  const details = (
    <List.Item
      actions={[
        <Button size="middle" type="text" shape="circle" icon={<UpOutlined />} onClick={() => setShowMore(false)} />,
        <Button size="middle" type="text" shape="circle" icon={<EditOutlined />} onClick={() => props.setWorkoutToEdit(props.workout.id)} />,
      ]}
    >
      <List.Item.Meta
        title={formatWorkoutTitle(props.workout)}
      />
      {props.workout.exercises.map((exercise) => {
        return <Card title={exercise.name}>
          {exercise.sets.map((set) => {
            return <p>{set.weight}</p>
          })}
        </Card>
      })}
    </List.Item>
  );

  return showMore ? details : summary;
};

const WorkoutsSummary: React.FC<WorkoutsSummaryProps> = (props) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={props.workouts}
      className='workouts-summary'
      renderItem={(item: Workout) => (
        <WorkoutSummaryListItem workout={item} setWorkoutToEdit={props.setWorkoutToEdit} />
      )}
    />
  );
};

const ExerciseSet: React.FC<{ set: ExerciseSet, onSave: (set: ExerciseSet) => void }> = ({ set, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [weight, setWeight] = useState(set.weight);
  const [reps, setReps] = useState(set.reps);

  const handleSave = () => {
    onSave({ weight, reps });
    setEditing(false);
  };

  return editing ? (
    <Space>
      <InputNumber min={1} value={weight} onChange={value => value && setWeight(value)} placeholder="Weight (lbs)" />
      <InputNumber min={1} value={reps} onChange={value => value && setReps(value)} placeholder="Reps" />
      <Button icon={<SaveOutlined />} onClick={handleSave} />
    </Space>
  ) : (
    <Space>
      <span>{weight} lbs</span>
      <span>{reps} reps</span>
      <Button icon={<EditOutlined />} onClick={() => setEditing(true)} />
    </Space>
  );
};

const EditExercise: React.FC<EditExerciseProps> = ({ exercise, onExerciseChange }) => {
  const handleSetChange = (index: number, updatedSet: ExerciseSet) => {
    const newSets = [...exercise.sets];
    newSets[index] = updatedSet;
    onExerciseChange({ ...exercise, sets: newSets });
  };

  return (
    <Card title={exercise.name}>
      <List
        dataSource={exercise.sets}
        renderItem={(set, index) => (
          <List.Item>
            <ExerciseSet set={set} onSave={updatedSet => handleSetChange(index, updatedSet)} />
          </List.Item>
        )}
      />
    </Card>
  );
};

const EditWorkout: React.FC<EditWorkoutProps> = ({ workouts, workoutToEdit, setWorkouts, setWorkoutToEdit }) => {
  const [workout, setWorkout] = useState<Workout>(() => {
    const found = workouts.find((value) => value && (value.id === workoutToEdit));
    if (found) {
      return copyWorkout(found);
    } else {
      return createNewWorkout(workouts[workouts.length - 1].id + 1);
    }
  });

  const handleSave = () => {
    if (workout.id > workouts[workouts.length - 1].id) {
      setWorkouts([
        ...workouts,
        workout,
      ]);
    } else {
      setWorkouts(workouts.map((item) => item.id === workout.id ? workout : item));
    }
    setWorkoutToEdit(null);
  };

  const handleCancel = () => {
    setWorkoutToEdit(null);
  };

  const handleExerciseChange = (index: number, updatedExercise: Exercise) => {
    const newWorkout = copyWorkout(workout);
    newWorkout.exercises[index] = updatedExercise;
    setWorkout(newWorkout);
  };

  return (
    <div>
      <List
        dataSource={workout.exercises}
        renderItem={(exercise, index) => (
          <List.Item>
            <EditExercise exercise={exercise} onExerciseChange={updatedExercise => handleExerciseChange(index, updatedExercise)} />
          </List.Item>
        )}
      />
      <Button type="primary" onClick={handleSave}>Save</Button>
      <Button type="default" onClick={handleCancel}>Cancel</Button>
    </div>
  );
};

const MainContent: React.FC<{ colorBgContainer: string }> = ({ colorBgContainer }) => {
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [workoutToEdit, setWorkoutToEdit] = useState<number | null>(null);

  return (
    <div>
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <Breadcrumb items={[{ title: 'All Workouts' }, { title: 'Today\'s Workout' }]} />
        {workoutToEdit ? (
          <EditWorkout workouts={workouts} workoutToEdit={workoutToEdit} setWorkouts={setWorkouts} setWorkoutToEdit={setWorkoutToEdit}/>
        ) : (
          <div style={{ padding: 24, minHeight: 720, background: colorBgContainer, color: 'black'}}>
            <WorkoutsSummary workouts={workouts} setWorkoutToEdit={setWorkoutToEdit}/>
          </div>
        )}
        {!workoutToEdit && (
          <Button size="large" type="default" shape="circle" icon={<UploadOutlined />} onClick={() => setWorkoutToEdit(-1)} />
        )}
      </Content>
    </div>
  )
};

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // const handleAddWorkoutButtonClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  //   console.log(e);
  // };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
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
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <MainContent colorBgContainer={ colorBgContainer } />
        {/* <Footer style={{ textAlign: 'right' }}>
          <Button size="large" type="default" shape="circle" icon={<UploadOutlined />} onClick={handleAddWorkoutButtonClick} />
        </Footer> */}
      </Layout>
    </Layout>
  );
};

// export default function App() {
//   const [useNarrowLayout, setUseNarrowLayout] = useState(false);

//   const checkWindowSize = () => {
//     console.log('triggered');
//     if (window.innerWidth < 768) {
//       console.log('narrow');
//       setUseNarrowLayout(true);
//     } else {
//       setUseNarrowLayout(false);
//     }
//   };

//   useEffect(() => {
//     checkWindowSize();
//     window.addEventListener('resize', checkWindowSize);
//     return () => {
//       window.removeEventListener('resize', checkWindowSize);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col md:flex-row">
//       {!useNarrowLayout && (
//         <div className="fixed inset-0 flex-none md:relative md:w-64 bg-black text-white" style={{ width: '200px' }}>
//           This is the side bar!
//         </div>
//       )}
//       <div className="flex-1 bg-gray-300" style={{ marginLeft: useNarrowLayout ? '200px' : '0' }}>
//         {useNarrowLayout && (
//           <div className="w-full bg-gray-200">
//             <button>Toggle Sidebar</button>
//           </div>
//         )}
//         This is the main content!
//       </div>
//     </div>
//   );
// }

export default App;
