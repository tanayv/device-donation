import Image from 'next/image'
import { useState, useRef } from 'react'
import styles from '../../styles/Track.module.css'
import controls from './track.config'
import axios from 'axios';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useToasts } from 'react-toast-notifications';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

export default function Track() {  
    const [trackingKey, setTrackingKey] = useState(null);
    const [trackingKeyValid, setTrackingKeyValid] = useState(false); 
    const [trackingResponse, setTrackingResponse] = useState(null);
    const [HCaptchaToken, setHCaptchaToken] = useState(null);
    const captchaRef = useRef(null);

    const handleInput = (e) => {
        setTrackingKey(e.target.value);
        setTrackingKeyValid(e.target.validity.valid);
    }

    const onVerifyCaptcha = (token) => {
        setHCaptchaToken(token);
    }

    const { addToast } = useToasts();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/track`, {
            id: trackingKey
            })
            const { error, success } = response.data;
            // setHCaptchaToken(null);
            // captchaRef.current.resetCaptcha();
            if(error) {
                addToast(error, { appearance: 'error'});  
            }
            if(success) {
                setTrackingResponse(success.data);
            }
        } catch(err) {                             
            addToast(err.message, { appearance: 'error'});            
        }        
    }
    
    return (                                   
            <>
                <h2 className='text-center'>Track &#47; ट्रैक</h2>     
                <div className={`${styles.grid}`}>            
                    <div className={`card`}>        
                        <h2 className='text-center'>Enter tracking ID &#47; ट्रैकिंग आईडी भरें</h2>        
                        <form className={styles.form}>
                            {controls.map((control) => <input 
                                key={control.name}
                                type={control.type} 
                                name={control.name} 
                                autoComplete={control.autocomplete}
                                required={control.required}
                                placeholder={control.placeholder} 
                                pattern={control.pattern}
                                onChange={handleInput} />)}  
                            {/* <HCaptcha ref={captchaRef} size='normal' sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY} onVerify={onVerifyCaptcha}/>      */}
                            <button autoComplete='off' disabled={!trackingKeyValid} onClick={handleSubmit}>Submit</button> 
                        </form>
                    </div>                     
                    <div className={`card`}>        
                        <h2 className='text-center'>Status &#47; स्थिति</h2>        
                        <table className={styles.table}>
                            <tbody className={styles.tableBody}>
                                <tr className={`${styles.tableRow} ${styles.tableHeader}`}>
                                    <th>Donor Mobile No.</th>
                                    <th>Received</th>
                                    <th>Delivered</th>
                                </tr>
                                 
                                <tr className={styles.tableRow}>
                                {trackingResponse ?
                                <>                                    
                                    <td className={styles.tableCell}>{trackingResponse.phone_number}</td>
                                    <td className={`${styles.tableCell} ${trackingResponse.is_device_received ? styles.success : styles.error}`}>
                                        {trackingResponse.is_device_received ? <CheckCircleIcon /> : <CancelIcon/>}
                                    </td>
                                        <td className={`${styles.tableCell} ${trackingResponse.is_device_delivered ? styles.success : styles.error}`}>
                                        {trackingResponse.is_device_delivered ? <CheckCircleIcon/> : <CancelIcon/>}
                                    </td>
                                </> : <></>}
                                </tr>                                
                            </tbody>
                        </table>
                    </div>                                                           
                </div>
            </>             
        )                   
}
