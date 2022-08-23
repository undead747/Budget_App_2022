import React, { useState } from 'react'
import { useFirestore } from '../../../Database/useFirestore';
import { useHomeController } from '../../HomeContext';

export default function useCreateCategoryModal() {
    // #region State 
    const [show, setShow] = useState(false);
    // #endregion State 

    const handleShow = () => setShow(true);

    const handleClose = () => setShow(false);


    const CreateCategoryModal = ({ collectionName, ...rest }) => {
        // Get loading animantion, alert message from home-Controller.
        const { setLoading} = useHomeController();

        // Database method
        const { addDocument } = useFirestore(collectionName);

        const handleSubmit = async (category) => {
            try {
                setLoading(true);
                await addDocument(category);
                setLoading(false);
            } catch (error) {

            }
        }

        return (
            <>
                
            </>
        )
    }
}
