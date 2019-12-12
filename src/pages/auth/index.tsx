import React from 'react';
import {Formik, Form, Field} from 'formik';

interface LoginFormInputs {
    id: string,
    password: string
}

const Login = () => {
    const initialValues: LoginFormInputs = {id: "", password: ""};
    return (
      <div className="bg-white rounded-b shadow-lg">

          <Formik
              initialValues={initialValues}
              onSubmit={(values, {setSubmitting}) => (alert(JSON.stringify(values, null, 2)))}>
          </Formik>
          <Form>
              <Field type="text" name="id" />
              <Field type="password" name="password" />

              <button type="submit" className="rounded-full py-2 px-4 bg-indigo-500 text-indigo-300 font-bold">
                  Se connecter
              </button>
          </Form>
      </div>
    );
};
export default Login;